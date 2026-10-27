'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      orderId: { allowNull: false, primaryKey: true, type: Sequelize.INTEGER, references: { model: 'Orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      productId: { allowNull: false, primaryKey: true, type: Sequelize.INTEGER, references: { model: 'Products', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      quantity: { allowNull: false, type: Sequelize.INTEGER },
      price: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('OrderItems');
  },
};
