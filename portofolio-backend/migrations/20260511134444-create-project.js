'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      type: { type: Sequelize.INTEGER },
      judul: { type: Sequelize.STRING(255), allowNull: false },
      deskripsi: { type: Sequelize.TEXT },
      teknologi: { type: Sequelize.STRING(255) },
      url_github: { type: Sequelize.STRING(500) },
      url_demo: { type: Sequelize.STRING(500) },
      gambar: { type: Sequelize.STRING(500) },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Projects');
  }
};