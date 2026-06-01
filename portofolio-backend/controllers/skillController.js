'use strict';
const { Skill } = require('../models');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [['kategori', 'ASC'], ['nama', 'ASC']]
    });
    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill tidak ditemukan'
      });
    }
    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = async (req, res) => {
  try {
    const { nama, kategori, level, icon, deskripsi } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama skill wajib diisi'
      });
    }

    const skill = await Skill.create({
      nama,
      kategori,
      level: level || 'Pemula',
      icon,
      deskripsi
    });

    res.status(201).json({
      success: true,
      message: 'Skill berhasil ditambahkan',
      data: skill
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

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill tidak ditemukan'
      });
    }

    await skill.update(req.body);
    res.json({
      success: true,
      message: 'Skill berhasil diperbarui',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill tidak ditemukan'
      });
    }

    await skill.destroy();
    res.json({
      success: true,
      message: 'Skill berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
};