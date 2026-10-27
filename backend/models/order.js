'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Укажите адрес доставки' },
        len: { args: [5, 200], msg: 'Адрес доставки — от 5 до 200 символов' },
      },
    },
    deliveryDate: { type: DataTypes.DATE, allowNull: false },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        return Number(this.getDataValue('total'));
      },
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, { as: 'items', foreignKey: 'orderId' });
  };

  return Order;
};
