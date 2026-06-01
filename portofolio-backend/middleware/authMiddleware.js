'use strict';
const jwt = require('jsonwebtoken');

// Middleware untuk proteksi route (harus login lewat JWT)
const protect = (req, res, next) => {
  let token;

  // Cek apakah ada header Authorization dengan format 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token string
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token menggunakan secret key dari .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY_SUPER_RAHASIA');

      // Simpan data user hasil decode ke dalam objek request
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau telah kedaluwarsa. Silakan login kembali.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token otentikasi tidak ditemukan.'
    });
  }
};

// Middleware untuk khusus Admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini.'
    });
  }
};

// Middleware untuk halaman yang hanya boleh diakses guest (login/register)
const guestOnly = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return res.status(400).json({
      success: false,
      message: 'Anda sudah login.'
    });
  }
  next();
};

module.exports = { protect, adminOnly, guestOnly };