'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Этот логин уже занят' },
        validate: {
          notNull: { msg: 'Укажите логин' },
          is: {
            args: /^[a-zA-Z0-9_.-]{3,32}$/,
            msg: 'Логин: от 3 до 32 символов — латинские буквы, цифры, «_», «.» или «-»',
          },
        },
      },
      // Хеш пароля (scrypt), сам пароль не хранится
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: { withPassword: { attributes: { include: ['password'] } } },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.CartItem, { as: 'cartItems', foreignKey: 'userId' });
    User.hasMany(models.Order, { as: 'orders', foreignKey: 'userId' });
  };

  return User;
};
