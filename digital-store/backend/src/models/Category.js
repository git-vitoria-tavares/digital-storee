const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Category',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      use_in_menu: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { tableName: 'categories', timestamps: true }
  );
