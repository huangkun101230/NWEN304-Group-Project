'use strict';

module.exports = function(sequelize, DataTypes) {
  var admin = sequelize.define('admin', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user: {
       type: DataTypes.STRING
    },
    to_ship: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return admin;
};