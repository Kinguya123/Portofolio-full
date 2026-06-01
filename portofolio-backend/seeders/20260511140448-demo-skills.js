'use strict';

module.exports = {
  async up(queryInterface) {
    const skillsData = [
      // ========== FRONTEND SKILLS ==========
      {
        nama: 'HTML & CSS',
        kategori: 'Frontend',
        level: 'Mahir',
        icon: '🌐',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'JavaScript',
        kategori: 'Frontend',
        level: 'Mahir',
        icon: '📜',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'React.js',
        kategori: 'Frontend',
        level: 'Mahir',
        icon: '⚛️',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ========== BACKEND SKILLS ==========
      {
        nama: 'Express.js',
        kategori: 'Backend',
        level: 'Menengah',
        icon: '🚀',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Sequelize (ORM)',
        kategori: 'Backend',
        level: 'Menengah',
        icon: '🗄️',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'ORM untuk mengelola database MySQL',
        kategori: 'Backend',
        level: 'Menengah',
        icon: '🔧',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ========== DATABASE SKILLS ==========
      {
        nama: 'MySQL',
        kategori: 'Database',
        level: 'Pemula',
        icon: '🐬',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Manajemen database relasional',
        kategori: 'Database',
        level: 'Mahir',
        icon: '💾',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Skills', skillsData);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Skills', null, {});
  }
};