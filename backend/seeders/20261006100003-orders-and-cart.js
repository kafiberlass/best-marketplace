'use strict';

const DAY = 24 * 60 * 60 * 1000;

// Заказы maria: [сколько дней назад оформлен, адрес, [[товар, количество], ...]]
const ORDERS = [
  [20, 'Казань, ул. Баумана, д. 15, кв. 4', [['Ноутбук', 1], ['Керамическая кружка', 2]]],
  [8, 'Казань, ул. Пушкина, д. 3', [['Кроссовки', 1], ['Городской рюкзак', 1], ['Книга «Чистый код»', 1]]],
  [2, 'Казань, ул. Баумана, д. 15, кв. 4', [['Беспроводные наушники', 1]]],
  [0.2, 'Казань, ул. Кремлёвская, д. 18', [['Настольная лампа', 1], ['Комнатное растение', 3]]],
];

// Корзина maria - сохраняется между входами
const CART = [['Умные часы', 1], ['Керамическая кружка', 2]];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [[user]] = await queryInterface.sequelize.query(`SELECT id FROM "Users" WHERE login = 'maria'`);
    const [products] = await queryInterface.sequelize.query(`SELECT id, title, price FROM "Products"`);
    const product = Object.fromEntries(products.map((p) => [p.title, { id: p.id, price: Number(p.price) }]));

    for (const [daysAgo, address, items] of ORDERS) {
      const createdAt = new Date(Date.now() - daysAgo * DAY);
      const total = items.reduce((sum, [title, quantity]) => sum + product[title].price * quantity, 0);
      const [[order]] = await queryInterface.sequelize.query(
        `INSERT INTO "Orders" ("userId", address, "deliveryDate", total, "createdAt", "updatedAt")
         VALUES (:userId, :address, :deliveryDate, :total, :createdAt, :createdAt) RETURNING id`,
        {
          replacements: {
            userId: user.id,
            address,
            deliveryDate: new Date(createdAt.getTime() + 3 * DAY),
            total,
            createdAt,
          },
        }
      );
      await queryInterface.bulkInsert(
        'OrderItems',
        items.map(([title, quantity]) => ({
          orderId: order.id,
          productId: product[title].id,
          quantity,
          price: product[title].price,
          createdAt,
          updatedAt: createdAt,
        }))
      );
    }

    const now = new Date();
    await queryInterface.bulkInsert(
      'CartItems',
      CART.map(([title, quantity]) => ({ userId: user.id, productId: product[title].id, quantity, createdAt: now, updatedAt: now }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('CartItems', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
