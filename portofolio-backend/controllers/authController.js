'use strict';
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      nama: user.nama, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'SECRET_KEY_SUPER_RAHASIA',
    { expiresIn: '1d' } // Token expires in 24 hours
  );
};

// @desc    Halaman Login Info (GET)
// @route   GET /api/auth/login
// @access  Public
const loginPage = (req, res) => {
  res.json({
    success: true,
    message: 'Silakan login menggunakan method POST',
    data: {
      email: 'string',
      password: 'string'
    }
  });
};

// @desc    Proses Login (POST)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Cek password menggunakan instance method dari model Anda
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token JWT
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login berhasil',
      token, // Axios picks this up instantly
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Proses Register (POST)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi'
      });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Buat user baru (pastikan model User menghash password secara otomatis via hooks)
    const user = await User.create({
      nama,
      email,
      password,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil, silakan login',
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout (Handled client-side with JWT, but returns clean status)
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout berhasil. Hapus token Anda dari localStorage frontend.'
  });
};

// @desc    Get user yang sedang login via verified JWT req.user data
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
  // 'req.user' comes populated from your updated 'protect' middleware!
  if (req.user) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token otentikasi tidak valid atau tidak terbaca.'
    });
  }
};

module.exports = { loginPage, login, register, logout, getMe };