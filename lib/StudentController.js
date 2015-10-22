"use strict";

var models = require('../models');

exports.app = function (req, res) {
    models.Teacher.findOne({
        where: { url: req.params.random }
    }).then(function (data) {
        if (!data.dataValues) {
            return res.sendStatus(404).end('<h1>404: NOT FOUND</h1>');
        }
        else {
            return res.render(__dirname + '/../views/student', {
                teacher: data.dataValues
            });
        }
    });
}