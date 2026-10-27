'use strict';

const { hashPassword } = require('../lib/password');

// Тестовые учётные записи (логин / пароль):
//   maria / buyer123 - есть заказы и товары в корзине
//   alex  / buyer123 - новый покупатель без заказов
const USERS = [
  { login: 'maria', password: 'buyer123' },
  { login: 'alex', password: 'buyer123' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];
    for (const user of USERS) {
      rows.push({ ...user, password: await hashPassword(user.password), createdAt: now, updatedAt: now });
    }
    await queryInterface.bulkInsert('Users', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
