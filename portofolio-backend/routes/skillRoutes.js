'use strict';
const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes (bisa diakses semua orang)
router.get('/', getAllSkills);
router.get('/:id', getSkillById);

// Admin only routes (CRUD)
router.post('/', protect, adminOnly, createSkill);
router.put('/:id', protect, adminOnly, updateSkill);
router.delete('/:id', protect, adminOnly, deleteSkill);

module.exports = router;