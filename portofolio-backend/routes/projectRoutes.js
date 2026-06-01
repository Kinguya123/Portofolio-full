'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer'); // 1. Import Multer

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 2. ✨ FIX: KONFIGURASI PENYIMPANAN DI MEMORI (RAM)
// File tidak lagi masuk ke folder public/uploads, melainkan ditampung sementara sebagai Buffer di RAM
const storage = multer.memoryStorage();

// Filter untuk memastikan hanya file gambar yang boleh lolos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Harus berupa gambar.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Batasi ukuran file maks 2MB
});

// Public routes (bisa diakses semua orang)
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Admin only routes (CRUD)
// 3. 'upload.single('image')' sekarang akan mengirimkan data file berupa Buffer ke dalam `req.file`
router.post('/', protect, adminOnly, upload.single('image'), createProject);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;