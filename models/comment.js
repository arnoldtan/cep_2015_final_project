"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    content: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
          notEmpty: true
        }
    }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Comment;
};