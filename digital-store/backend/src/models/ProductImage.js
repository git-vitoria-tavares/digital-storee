const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ProductImage',
    {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      path: { type: DataTypes.STRING, allowNull: false }, // ex.: media/products/foto.jpeg
    },
    { tableName: 'product_images', timestamps: false }
  );
