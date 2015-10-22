"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
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
        Post.hasMany(models.Comment);
      }
    }
  });

  return Post;
};