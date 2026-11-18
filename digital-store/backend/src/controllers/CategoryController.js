const { Category } = require('../models');

const FIELDS = ['id', 'name', 'slug', 'use_in_menu'];

// GET /v1/category/search?limit=12&page=1&fields=name,slug&use_in_menu=true
async function search(req, res) {
  const limit = Number(req.query.limit || 12);
  const page = Number(req.query.page || 1);

  if (!Number.isInteger(limit) || !Number.isInteger(page) || page < 1 || limit === 0 || limit < -1) {
    return res.status(400).json({ message: 'limit e page devem ser números válidos' });
  }

  const options = { where: {}, attributes: FIELDS };

  if (req.query.fields) {
    options.attributes = req.query.fields.split(',').filter((field) => FIELDS.includes(field));
  }
  if (req.query.use_in_menu) {
    options.where.use_in_menu = req.query.use_in_menu === 'true';
  }
  // limit = -1 busca tudo, sem paginação
  if (limit !== -1) {
    options.limit = limit;
    options.offset = (page - 1) * limit;
  }

  const { rows, count } = await Category.findAndCountAll(options);
  res.status(200).json({ data: rows, total: count, limit, page });
}

// GET /v1/category/:id
async function show(req, res) {
  const category = await Category.findByPk(req.params.id, { attributes: FIELDS });
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });

  res.status(200).json(category);
}

// POST /v1/category
async function create(req, res) {
  const { name, slug, use_in_menu } = req.body || {};
  if (!name || !slug) return res.status(400).json({ message: 'Preencha name e slug' });

  const category = await Category.create({ name, slug, use_in_menu });
  res.status(201).json({ id: category.id, name, slug, use_in_menu: Boolean(use_in_menu) });
}

// PUT /v1/category/:id
async function update(req, res) {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });

  const { name, slug, use_in_menu } = req.body || {};
  if (!name || !slug) return res.status(400).json({ message: 'Preencha name e slug' });

  await category.update({ name, slug, use_in_menu });
  res.status(204).end();
}

// DELETE /v1/category/:id
async function remove(req, res) {
  const deleted = await Category.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Categoria não encontrada' });

  res.status(204).end();
}

module.exports = { search, show, create, update, remove };
