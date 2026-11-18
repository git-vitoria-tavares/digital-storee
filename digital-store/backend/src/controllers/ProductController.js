const { Op } = require('sequelize');
const { Product, ProductImage, ProductOption, ProductCategory, Category } = require('../models');
const { saveImage, imageUrl } = require('../services/imageService');

// Dados relacionados que vêm junto com o produto (imagens e opções em ordem de cadastro)
const include = [
  { model: ProductImage, as: 'images', separate: true, order: [['id', 'ASC']] },
  { model: ProductOption, as: 'options', separate: true, order: [['id', 'ASC']] },
  { model: Category, as: 'categories', attributes: ['id'] },
];

// Monta o JSON do produto no formato pedido pelo README
function formatProduct(product) {
  return {
    id: product.id,
    enabled: product.enabled,
    name: product.name,
    slug: product.slug,
    stock: product.stock,
    description: product.description,
    price: product.price,
    price_with_discount: product.price_with_discount,
    category_ids: product.categories.map((category) => category.id).sort((a, b) => a - b),
    images: product.images.map((image) => ({ id: image.id, content: imageUrl(image.path) })),
    options: product.options.map((option) => ({
      id: option.id,
      title: option.title,
      shape: option.shape,
      radius: option.radius,
      type: option.type,
      values: option.values.split(','),
    })),
  };
}

// Converte uma opção do corpo da requisição para o formato da tabela
// Aceita "values" ou "value", como array (["P","M"]) ou texto ("P,M"); radius aceita 4 ou "4px"
function optionData(option) {
  const data = {};
  const values = option.values || option.value;

  if (option.title) data.title = option.title;
  if (option.shape) data.shape = option.shape;
  if (option.type) data.type = option.type;
  if (option.radius !== undefined) data.radius = parseInt(option.radius) || 0;
  if (values) data.values = Array.isArray(values) ? values.join(',') : values;

  return data;
}

// Salva imagens e opções de um produto (usado no cadastro e na atualização)
async function saveImagesAndOptions(productId, images = [], options = []) {
  for (const image of images) {
    if (image.deleted) {
      await ProductImage.destroy({ where: { id: image.id, product_id: productId } });
    } else if (image.id) {
      await ProductImage.update({ path: saveImage(image) }, { where: { id: image.id, product_id: productId } });
    } else {
      await ProductImage.create({ product_id: productId, enabled: true, path: saveImage(image) });
    }
  }

  for (const option of options) {
    if (option.deleted) {
      await ProductOption.destroy({ where: { id: option.id, product_id: productId } });
    } else if (option.id) {
      await ProductOption.update(optionData(option), { where: { id: option.id, product_id: productId } });
    } else {
      await ProductOption.create({ ...optionData(option), product_id: productId });
    }
  }
}

// Confere se todas as categorias informadas existem
async function categoriesExist(categoryIds = []) {
  const count = await Category.count({ where: { id: categoryIds } });
  return count === categoryIds.length;
}

// GET /v1/product/search
async function search(req, res) {
  const limit = Number(req.query.limit || 12);
  const page = Number(req.query.page || 1);

  if (!Number.isInteger(limit) || !Number.isInteger(page) || page < 1 || limit === 0 || limit < -1) {
    return res.status(400).json({ message: 'limit e page devem ser números válidos' });
  }

  // Cada filtro vira uma condição; todas precisam ser verdadeiras
  const filters = [];

  // match=Tênis -> procura no nome ou na descrição
  if (req.query.match) {
    const text = `%${req.query.match}%`;
    filters.push({ [Op.or]: [{ name: { [Op.like]: text } }, { description: { [Op.like]: text } }] });
  }

  // category_ids=1,6 -> produtos dessas categorias
  if (req.query.category_ids) {
    const links = await ProductCategory.findAll({ where: { category_id: req.query.category_ids.split(',') } });
    filters.push({ id: links.map((link) => link.product_id) });
  }

  // price-range=100-200 -> preço (com desconto) entre 100 e 200
  if (req.query['price-range']) {
    const [min, max] = req.query['price-range'].split('-').map(Number);
    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ message: 'Use price-range no formato 100-200' });
    }
    filters.push({ price_with_discount: { [Op.between]: [min, max] } });
  }

  // option[45]=GG,PP -> produtos cuja opção 45 tenha o valor GG ou PP
  for (const key of Object.keys(req.query)) {
    const optionId = key.match(/^option\[(\d+)\]$/)?.[1];
    if (!optionId) continue;

    const wanted = req.query[key].split(',');
    const options = await ProductOption.findAll({ where: { id: optionId } });
    const matching = options.filter((option) => option.values.split(',').some((v) => wanted.includes(v)));
    filters.push({ id: matching.map((option) => option.product_id) });
  }

  const where = { [Op.and]: filters };
  const total = await Product.count({ where });

  const options = { where, include, order: [['id', 'ASC']] };
  if (limit !== -1) {
    options.limit = limit;
    options.offset = (page - 1) * limit;
  }
  const products = await Product.findAll(options);

  // fields=name,price -> devolve só esses campos
  let data = products.map(formatProduct);
  if (req.query.fields) {
    const fields = req.query.fields.split(',');
    data = data.map((product) => Object.fromEntries(fields.map((field) => [field, product[field]])));
  }

  res.status(200).json({ data, total, limit, page });
}

// GET /v1/product/:id
async function show(req, res) {
  const product = await Product.findByPk(req.params.id, { include });
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

  res.status(200).json(formatProduct(product));
}

// POST /v1/product
async function create(req, res) {
  const body = req.body || {};

  if (!body.name || !body.slug || typeof body.price !== 'number' || typeof body.price_with_discount !== 'number') {
    return res.status(400).json({ message: 'Preencha name, slug, price e price_with_discount' });
  }
  if (!(await categoriesExist(body.category_ids))) {
    return res.status(400).json({ message: 'Categoria não encontrada' });
  }

  const product = await Product.create(body);
  await product.setCategories(body.category_ids || []);
  await saveImagesAndOptions(product.id, body.images, body.options);

  const created = await Product.findByPk(product.id, { include });
  res.status(201).json(formatProduct(created));
}

// PUT /v1/product/:id
async function update(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

  const body = req.body || {};
  if (body.category_ids && !(await categoriesExist(body.category_ids))) {
    return res.status(400).json({ message: 'Categoria não encontrada' });
  }

  await product.update(body);
  if (body.category_ids) await product.setCategories(body.category_ids);
  await saveImagesAndOptions(product.id, body.images, body.options);

  res.status(204).end();
}

// DELETE /v1/product/:id
async function remove(req, res) {
  const deleted = await Product.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Produto não encontrado' });

  res.status(204).end();
}

module.exports = { search, show, create, update, remove };
