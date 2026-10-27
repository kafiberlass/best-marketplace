'use strict';

// Позиция заказа. Цена сохраняется на момент покупки - если товар потом подорожает, заказ не изменится
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: { type: DataTypes.INTEGER, primaryKey: true },
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        return Number(this.getDataValue('price'));
      },
    },
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
  };

  return OrderItem;
};
