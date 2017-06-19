'use strict';
var faker = require('faker');
module.exports = function(sequelize, DataTypes) {
  var products = sequelize.define('products', {
    product_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    product_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    product_des: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    price: DataTypes.STRING,
    in_stock: DataTypes.INTEGER,
    picture_dir: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return products;
};