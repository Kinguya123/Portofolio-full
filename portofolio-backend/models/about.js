'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class About extends Model {
    static associate(models) {}
  }

  About.init({
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kelas: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sekolah: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'About',
    tableName: 'Abouts' // Sesuaikan dengan penamaan plural Sequelize
  });

  return About;
};