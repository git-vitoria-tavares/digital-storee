const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config);

const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const ProductImage = require('./ProductImage')(sequelize);
const ProductOption = require('./ProductOption')(sequelize);
const ProductCategory = require('./ProductCategory')(sequelize);

// Relacionamentos
Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(ProductOption, { as: 'options', foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.belongsToMany(Category, {
  through: ProductCategory,
  as: 'categories',
  foreignKey: 'product_id',
  otherKey: 'category_id',
});
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'category_id', otherKey: 'product_id' });

module.exports = { sequelize, User, Category, Product, ProductImage, ProductOption, ProductCategory };
