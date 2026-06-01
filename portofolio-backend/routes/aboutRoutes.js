'use strict';
const express = require('express');
const router = express.Router();
const { About } = require('../models');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get about data (Public / Private)
// @route   GET /api/about
router.get('/', async (req, res) => {
  try {
    const [about] = await About.findOrCreate({
      where: { id: 1 },
      defaults: {
        nama: 'Fikry Azzam Zalfa Ash Shiddieq Yassin',
        kelas: 'XI RPL A',
        sekolah: 'SMK PK Pusdikhubad',
        bio: 'Saya adalah siswa kelas XI Rekayasa Perangkat Lunak yang memiliki minat di bidang pemrograman web.'
      }
    });
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update atau Create data about (Admin Only)
// @route   PUT /api/about
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const { bio, nama, kelas, sekolah } = req.body;

    // ✨ JAUH LEBIH STABIL: Cari dulu ID 1, jika ada langsung update, jika tidak ada baru buat baru
    let about = await About.findByPk(1);
    
    if (about) {
      await about.update({ bio, nama, kelas, sekolah });
    } else {
      about = await About.create({ id: 1, bio, nama, kelas, sekolah });
    }

    res.json({
      success: true,
      message: 'Data Tentang Saya berhasil diperbarui!',
      data: about
    });
  } catch (error) {
    // ✨ KIRIM KODE ERROR ASLI: Biar langsung tampil di layar front-end kamu
    res.status(500).json({
      success: false,
      message: `Error Server: ${error.message}`
    });
  }
});

module.exports = router;