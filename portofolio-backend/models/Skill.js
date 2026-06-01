'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {}
  }

  Skill.init({
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama skill tidak boleh kosong' }
      }
    },
    kategori: DataTypes.STRING(100),
    level: {
      type: DataTypes.ENUM('Pemula', 'Menengah', 'Mahir'),
      defaultValue: 'Pemula'
    },
    icon: DataTypes.STRING(50),
    deskripsi: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Skill'
  });

  return Skill;
};