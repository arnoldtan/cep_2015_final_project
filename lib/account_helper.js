"use strict";

var models = require('../models');
var bcrypt = require("bcrypt");

exports.login = function (req, res) {
  if (req.session.authenticated) return res.redirect('/dashboard');
  models.User.findOne({
    where: { username: req.body.username }
  }).then(function (data) {
    if (!data) {
      return res.redirect('/');
    }
    bcrypt.compare(req.body.password, data.dataValues.password, function (err, match) {
      if (!match) {
        return res.redirect('/');
      }
      req.session.authenticated = true;
      req.session.user = data.dataValues;
      return res.redirect('/dashboard');
    });
  })
}

exports.logout = function (req, res) {
	req.session.destroy();
	return res.redirect('/');
}

exports.signup = function (req, res) {
  if (req.session.authenticated) return res.redirect('/dashboard');
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      models.User.create({
        username: req.body.username,
        password: hash,
        type: req.body.type
      })
      .then(function (data) {
        return exports.login(req, res);
      })
      .error(function (error) {
        if (error) {
          console.log(error);
          return res.redirect('/');
        }
      });
    });
  });
}