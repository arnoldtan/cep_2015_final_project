"use strict";

var models = require('../models');
var fs = require('fs');
var path = require('path');
var resource_dir = path.resolve(__dirname + '/../resource/');
var multiparty = require('multiparty');

exports.resourcePage = function(req, res) {
	models.User.findOne({
		where: {
			username: req.session.user.username
		}
	}).then(function(user) {
		models.Class.findOne({
			where: {
				classCode: req.params.classCode
			}
		}).then(function(Class) {
			getClassResource(req.params.classCode, function(err, files) {
			return res.render(__dirname + '/../views/resource.ejs', {
				user: user,
				files: files,
				Class: Class
			});
		});
	});
	})
};

exports.uploadFile = function(req, res) {
	if (req.session.user.type !== 'teacher') return res.status(403);
	var form = new multiparty.Form();

  form.parse(req, function(err, fields, files) {
  	var readstream = fs.createReadStream(files.upload[0].path);
  	var file_dir = resource_dir + '/' + String(req.params.classCode) + '/' + String(files.upload[0].originalFilename);
  	var writestream = fs.createWriteStream(file_dir);
  	readstream.pipe(writestream);
  });

	return res.redirect(req.originalUrl);
};

exports.downloadFile = function(req, res) {
	var file_dir = resource_dir + '/' + String(req.params.classCode) + '/' + String(req.params.fileName);
	var stat = fs.statSync(file_dir);

  res.writeHead(200, {
    'Content-Length': stat.size
  });

	fs.createReadStream(file_dir).pipe(res);
};

exports.deleteFile = function(req, res) {
	if (req.session.user.type !== 'teacher') return res.status(403);
	var file_dir = resource_dir + '/' + String(req.params.classCode) + '/' + String(req.params.fileName);
	fs.unlink(file_dir, function(err) {
		return res.status(200).redirect('/class/' + req.params.classCode + '/resource');
	});
};

var getClassResource = function(classCode, cb) {
	fs.readdir(resource_dir + '/' + String(classCode) + '/', function(err, files) {
		return cb(err, files);
	})
};