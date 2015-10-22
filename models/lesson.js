"use strict";

module.exports = function(sequelize, DataTypes) {
  var Lesson = sequelize.define("Lesson", {
    lessonName: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lessonUrl: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    image: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Lesson;
};