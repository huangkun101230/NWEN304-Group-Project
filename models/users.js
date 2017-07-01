'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      //allowNull: false,
      type: DataTypes.STRING
    },
    fbid:{
      type: DataTypes.STRING
    },
    token:{
      type:DataTypes.STRING
    },
    fbname:{
      type:DataTypes.STRING
    },
    admin:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return users;
};