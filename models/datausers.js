'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Datausers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Datausers.init({
    nama: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    air: DataTypes.NUMBER,
    sisa: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Datausers',
  });
  return Datausers;
};