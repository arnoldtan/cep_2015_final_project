"use strict";

var models = require('../models');
var shortid = require('shortid');

exports.app = function (req, res) {
    res.render(__dirname + '/../views/teacher', {
        teacher: req.session.user
    });
}

function startlesson (req, cb) {
    models.Teacher.findOne({
        where: { username: req.session.user.username }
    }).then(function (data) {
        if (data.dataValues.url !== null) return cb();
        models.Teacher.update({
            url: shortid.generate()
        }, {
            where: { username: req.session.user.username }
        }).then(function (data) {
            cb();
        });
    });
}

function endlesson (req, cb) {
    models.Teacher.update({
        url: null
    }, {
        where: { username: req.session.user.username }
    }).then(function (data) {
        cb();
    });
}