'use strict';

const bcrypt = require('bcrypt');

const categories = [
  { id: 1, name: 'Tênis', slug: 'tenis', use_in_menu: true },
  { id: 2, name: 'Camisetas', slug: 'camisetas', use_in_menu: true },
  { id: 3, name: 'Calças', slug: 'calcas', use_in_menu: true },
  { id: 4, name: 'Bonés', slug: 'bones', use_in_menu: true },
  { id: 5, name: 'Headphones', slug: 'headphones', use_in_menu: true },
  { id: 6, name: 'Ofertas', slug: 'ofertas', use_in_menu: true },
  { id: 7, name: 'Black Friday', slug: 'black-friday', use_in_menu: false },
];

// [nome, slug, preço, preço com desconto, categorias, número da foto]
const products = [
  ['Tênis Runner Masculino', 'tenis-runner-masculino', 200, 149.9, [1, 6], 1],
  ['Tênis Casual Street', 'tenis-casual-street', 249.9, 199.9, [1, 7], 2],
  ['Tênis Classic Branco', 'tenis-classic-branco', 179.9, 179.9, [1], 3],
  ['Tênis Urban Feminino', 'tenis-urban-feminino', 319.9, 259.9, [1, 6], 4],
  ['Tênis Training Pro', 'tenis-training-pro', 399.9, 349.9, [1, 7], 5],
  ['Tênis Retro Colors', 'tenis-retro-colors', 159.9, 159.9, [1], 1],
  ['Tênis Skate Low', 'tenis-skate-low', 219.9, 189.9, [1, 6], 2],
  ['Tênis Walk Comfort', 'tenis-walk-comfort', 139.9, 99.9, [1, 6, 7], 3],
  ['Tênis Basquete High', 'tenis-basquete-high', 499.9, 449.9, [1], 4],
  ['Tênis Corrida Leve', 'tenis-corrida-leve', 289.9, 289.9, [1], 5],
  ['Tênis Esportivo Kids', 'tenis-esportivo-kids', 119.9, 89.9, [1, 6], 1],
  ['Tênis Slip On Canvas', 'tenis-slip-on-canvas', 99.9, 79.9, [1, 7], 2],
];

module.exports = {
  async up(queryInterface) {
    // Usuário de teste: admin@digitalstore.com / 123@123
    await queryInterface.bulkInsert('users', [
      {
        firstname: 'Admin',
        surname: 'Digital Store',
        email: 'admin@digitalstore.com',
        password: await bcrypt.hash('123@123', 10),
      },
    ]);

    await queryInterface.bulkInsert('categories', categories);

    const images = [];
    const options = [];
    const productCategories = [];

    const productRows = products.map(([name, slug, price, discount, categoryIds, photo], index) => {
      const id = index + 1;

      // 1ª imagem = foto da listagem; depois as 5 fotos da galeria
      images.push({ product_id: id, enabled: true, path: `media/products/product-thumb-${photo}.jpeg` });
      for (let n = 1; n <= 5; n++) {
        images.push({ product_id: id, enabled: true, path: `media/products/produc-image-${n}.jpeg` });
      }

      options.push({ product_id: id, title: 'Tamanho', shape: 'square', radius: 4, type: 'text', values: '39,40,41,42,43' });
      options.push({ product_id: id, title: 'Cor', shape: 'circle', radius: 0, type: 'color', values: '#6FEEFF,#FF6969,#5E5E5E' });

      categoryIds.forEach((categoryId) => productCategories.push({ product_id: id, category_id: categoryId }));

      return {
        id,
        enabled: true,
        name,
        slug,
        stock: 10,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        price,
        price_with_discount: discount,
      };
    });

    await queryInterface.bulkInsert('products', productRows);
    await queryInterface.bulkInsert('product_images', images);
    await queryInterface.bulkInsert('product_options', options);
    await queryInterface.bulkInsert('product_categories', productCategories);
  },

  async down(queryInterface) {
    for (const table of ['product_categories', 'product_options', 'product_images', 'products', 'categories', 'users']) {
      await queryInterface.bulkDelete(table, null, {});
    }
  },
};
