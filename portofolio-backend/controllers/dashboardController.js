'use strict';
const { Project, Skill, User } = require('../models');

// @desc    Dashboard utama
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    // Cek session user
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Silakan login terlebih dahulu'
      });
    }

    // Ambil data statistik
    const totalProjects = await Project.count();
    const totalSkills = await Skill.count();
    const totalUsers = await User.count();
    
    // Ambil data terbaru
    const recentProjects = await Project.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    
    const recentSkills = await Skill.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        user: req.session.user,
        stats: {
          totalProjects,
          totalSkills,
          totalUsers,
          adminCount: await User.count({ where: { role: 'admin' } })
        },
        recent: {
          projects: recentProjects,
          skills: recentSkills
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Dashboard summary card
// @route   GET /api/dashboard/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const totalSkills = await Skill.count();
    const totalUsers = await User.count();
    
    // Hitung skill berdasarkan level
    const beginnerSkills = await Skill.count({ where: { level: 'Pemula' } });
    const intermediateSkills = await Skill.count({ where: { level: 'Menengah' } });
    const expertSkills = await Skill.count({ where: { level: 'Mahir' } });

    res.json({
      success: true,
      data: {
        projects: totalProjects,
        skills: totalSkills,
        users: totalUsers,
        skillLevels: {
          pemula: beginnerSkills,
          menengah: intermediateSkills,
          mahir: expertSkills
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Dashboard charts data
// @route   GET /api/dashboard/charts
// @access  Private
const getChartData = async (req, res) => {
  try {
    // Skill by category
    const frontendSkills = await Skill.count({ where: { kategori: 'Frontend' } });
    const backendSkills = await Skill.count({ where: { kategori: 'Backend' } });
    const databaseSkills = await Skill.count({ where: { kategori: 'Database' } });
    
    // Projects by technology (simple grouping)
    const allProjects = await Project.findAll();
    const techCount = {};
    allProjects.forEach(project => {
      if (project.teknologi) {
        const techs = project.teknologi.split(',').map(t => t.trim());
        techs.forEach(tech => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      }
    });

    res.json({
      success: true,
      data: {
        skillByCategory: {
          Frontend: frontendSkills,
          Backend: backendSkills,
          Database: databaseSkills
        },
        popularTechnologies: techCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getDashboard, getSummary, getChartData };