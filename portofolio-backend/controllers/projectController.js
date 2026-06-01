'use strict';
const { Project } = require('../models');

// Fungsi pembantu (helper) untuk mengubah nilai null menjadi string kosong
const sanitizeProject = (project) => {
  if (!project) return null;
  
  // Mengonversi instance Sequelize ke objek JavaScript biasa jika diperlukan
  const data = project.toJSON ? project.toJSON() : project;
  
  return {
    id: data.id,
    judul: data.judul || '',
    deskripsi: data.deskripsi || '',
    teknologi: data.teknologi || '',
    url_github: data.url_github || '',
    url_demo: data.url_demo || '',
    gambar: data.gambar || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']]
    });

    // PENYELESAIAN: Bersihkan semua item dalam array dari nilai null
    const sanitizedProjects = projects.map(project => sanitizeProject(project));

    res.json({
      success: true,
      count: sanitizedProjects.length,
      data: sanitizedProjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan'
      });
    }

    // PENYELESAIAN: Bersihkan data objek tunggal dari nilai null
    res.json({
      success: true,
      data: sanitizeProject(project)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { judul, deskripsi, teknologi, url_github, url_demo, gambar } = req.body;

    if (!judul) {
      return res.status(400).json({
        success: false,
        message: 'Judul wajib diisi'
      });
    }

    let gambarFinal = gambar || '';
    
    // ✨ FIX: Jika user upload file, konversi buffer file di RAM langsung ke Base64
    if (req.file) {
      const mimeType = req.file.mimetype;
      const base64String = req.file.buffer.toString('base64');
      gambarFinal = `data:${mimeType};base64,${base64String}`;
    }

    // Amankan payload sebelum masuk ke Sequelize agar menghindari nilai undefined
    const project = await Project.create({
      judul: judul || '',
      deskripsi: deskripsi || '',
      teknologi: teknologi || '',
      url_github: url_github || '',
      url_demo: url_demo || '',
      gambar: gambarFinal
    });

    res.status(201).json({
      success: true,
      message: 'Proyek berhasil ditambahkan',
      data: sanitizeProject(project) // Bersihkan data response
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

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan'
      });
    }

    // Amankan request data agar string kosong tidak memicu error database
    const updateData = {
      judul: req.body.judul !== undefined ? req.body.judul : project.judul,
      deskripsi: req.body.deskripsi !== undefined ? req.body.deskripsi : project.deskripsi,
      teknologi: req.body.teknologi !== undefined ? req.body.teknologi : project.teknologi,
      url_github: req.body.url_github !== undefined ? req.body.url_github : project.url_github,
      url_demo: req.body.url_demo !== undefined ? req.body.url_demo : project.url_demo,
      gambar: req.body.gambar !== undefined ? req.body.gambar : project.gambar
    };

    // ✨ FIX: Jika user mengupload file baru saat update, konversi langsung ke Base64
    if (req.file) {
      const mimeType = req.file.mimetype;
      const base64String = req.file.buffer.toString('base64');
      updateData.gambar = `data:${mimeType};base64,${base64String}`;
    }

    await project.update(updateData);
    
    res.json({
      success: true,
      message: 'Proyek berhasil diperbarui',
      data: sanitizeProject(project) // Bersihkan data response hasil update
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan'
      });
    }

    await project.destroy();
    res.json({
      success: true,
      message: 'Proyek berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};