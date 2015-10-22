"use strict";

module.exports = function(sequelize, DataTypes) {
  var Class = sequelize.define("Class", {
    className: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    classCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Class.belongsToMany(models.User, { through: 'UserClass' });
        Class.hasMany(models.Lesson);
        Class.hasMany(models.Post);
      }
    }
  });

  return Class;
};