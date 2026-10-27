'use strict';

// Товар в корзине пользователя. Корзина хранится на сервере,
// поэтому сохраняется после выхода из аккаунта и повторного входа
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
  };

  return CartItem;
};
