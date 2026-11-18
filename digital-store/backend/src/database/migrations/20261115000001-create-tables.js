'use strict';

// Cria todas as tabelas da loja. Rode com: npm run db:setup
module.exports = {
  async up(queryInterface, Sequelize) {
    const id = { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true };
    const timestamps = {
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    };
    // Chave estrangeira que apaga os registros filhos junto com o pai
    const foreignKey = (table) => ({
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: table, key: 'id' },
      onDelete: 'CASCADE',
    });

    await queryInterface.createTable('users', {
      id,
      firstname: { type: Sequelize.STRING, allowNull: false },
      surname: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      ...timestamps,
    });

    await queryInterface.createTable('categories', {
      id,
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false },
      use_in_menu: { type: Sequelize.BOOLEAN, defaultValue: false },
      ...timestamps,
    });

    await queryInterface.createTable('products', {
      id,
      enabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false },
      use_in_menu: { type: Sequelize.BOOLEAN, defaultValue: false },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      description: { type: Sequelize.STRING },
      price: { type: Sequelize.FLOAT, allowNull: false },
      price_with_discount: { type: Sequelize.FLOAT, allowNull: false },
      ...timestamps,
    });

    await queryInterface.createTable('product_images', {
      id,
      product_id: foreignKey('products'),
      enabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      path: { type: Sequelize.STRING, allowNull: false },
    });

    await queryInterface.createTable('product_options', {
      id,
      product_id: foreignKey('products'),
      title: { type: Sequelize.STRING, allowNull: false },
      shape: { type: Sequelize.ENUM('square', 'circle'), defaultValue: 'square' },
      radius: { type: Sequelize.INTEGER, defaultValue: 0 },
      type: { type: Sequelize.ENUM('text', 'color'), defaultValue: 'text' },
      values: { type: Sequelize.STRING, allowNull: false },
    });

    await queryInterface.createTable('product_categories', {
      product_id: { ...foreignKey('products'), primaryKey: true },
      category_id: { ...foreignKey('categories'), primaryKey: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_categories');
    await queryInterface.dropTable('product_options');
    await queryInterface.dropTable('product_images');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('users');
  },
};
