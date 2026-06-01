'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {}
  }

  Project.init({
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Judul tidak boleh kosong' }
      }
    },
    deskripsi: DataTypes.TEXT,
    teknologi: DataTypes.STRING(255),
    url_github: DataTypes.STRING(500),
    url_demo: DataTypes.STRING(500),
    // ✨ FIX: Diubah ke TEXT('long') agar muat menampung string Base64 gambar ukuran besar
    gambar: DataTypes.TEXT('long') 
  }, {
    sequelize,
    modelName: 'Project'
  });

  return Project;
};