'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Projects', [
      { 
        judul: 'SPA Portfolio Pribadi',
        deskripsi: 'Website portofolio dengan React + Vite.',
        teknologi: 'React, Vite, CSS', 
        url_github: 'https://github.com/siswa/portfolio',
        url_demo: null, 
        gambar: null, 
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      { 
        judul: 'Sistem Absensi Digital',
        deskripsi: 'Aplikasi absensi online berbasis web untuk sekolah.',
        teknologi: 'Laravel, MySQL, Bootstrap 5', 
        url_github: 'https://github.com/siswa/absensi',
        url_demo: null, 
        gambar: null, 
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      { 
        judul: 'Aplikasi Kasir Sederhana',
        deskripsi: 'Sistem point-of-sale untuk toko kecil.',
        teknologi: 'React, Express.js, MySQL', 
        url_github: 'https://github.com/siswa/kasir',
        url_demo: null, 
        gambar: null, 
        createdAt: new Date(), 
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Projects', null, {});
  }
};