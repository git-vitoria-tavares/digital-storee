const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'ProductOption',
    {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      shape: { type: DataTypes.ENUM('square', 'circle'), defaultValue: 'square' },
      radius: { type: DataTypes.INTEGER, defaultValue: 0 },
      type: { type: DataTypes.ENUM('text', 'color'), defaultValue: 'text' },
      values: { type: DataTypes.STRING, allowNull: false }, // ex.: "P,M,G"
    },
    { tableName: 'product_options', timestamps: false }
  );
