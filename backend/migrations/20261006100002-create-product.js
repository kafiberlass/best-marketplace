'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { allowNull: false, type: Sequelize.STRING },
      description: { allowNull: false, type: Sequelize.TEXT },
      price: { allowNull: false, type: Sequelize.DECIMAL(10, 2) },
      photo: { allowNull: false, type: Sequelize.STRING },
      vendorName: { allowNull: false, type: Sequelize.STRING },
      vendorInfo: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  },
};
