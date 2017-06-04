'use strict';
var faker = require('faker');
module.exports = function(sequelize, DataTypes) {
  var products = sequelize.define('products', {
    products_id: {
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
      type: DataTypes.STRING
    },
    price: DataTypes.STRING,
    in_stock: DataTypes.INTERGER,
    picture_dir: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  for (var index = 0; index < 50; index++) {
    products.create({
      product_name: faker.commerce.productName,
      product_des: faker.lorem.sentences,
      price: faker.commerce.price,
      in_stock: faker.random.number
    });
    
  }
  return products;
};