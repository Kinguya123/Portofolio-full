'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password manual karena bulkInsert tidak melewati hook model
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const hashedPassword2 = await bcrypt.hash('123456', salt);
    
    await queryInterface.bulkInsert('Users', [
      {
        nama: 'Admin Portofolio',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'User Biasa',
        email: 'user@gmail.com',
        password: hashedPassword2,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};