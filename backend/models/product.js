'use strict';

const money = (DataTypes) => ({
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,
  get() {
    const value = this.getDataValue('price');
    return value === null ? null : Number(value);
  },
});

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: money(DataTypes),
    // Путь к картинке на нашем сервере, например /images/headphones.svg
    photo: { type: DataTypes.STRING, allowNull: false },
    vendorName: { type: DataTypes.STRING, allowNull: false },
    vendorInfo: { type: DataTypes.TEXT },
  });

  return Product;
};
