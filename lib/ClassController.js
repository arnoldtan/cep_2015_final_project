"use strict";

var models = require('../models');
var shortid = require('shortid');
var fs = require('fs');
var path = require('path');
var resource_dir = path.resolve(__dirname + '/../resource/');

exports.addClass = function(req, res) {
	if (req.body.className.split(' ').join('').length === 0) return res.redirect('/dashboard');
	models.User.findOne({
		where: {
			username: req.session.user.username
		}
	}).then(function(user) {
		if (user.type === 'student') return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
		else {
			models.Class.create({
				className: req.body.className,
				classCode: shortid.generate()
			}).then(function(Class) {
				user.addClass(Class).then(function(data) {
					addClassFolder(Class.dataValues.classCode, function(err) {
						return res.redirect('/class/' + Class.classCode);
					});
				});
			});
		}
	});
}

var addClassFolder = function(classCode, cb) {
	fs.mkdir(resource_dir + '/' + String(classCode) + '/', function(err) {
		return cb(err);
	});
}

exports.joinClass = function(req, res) {
	if (req.session.user.type === 'teacher') return res.status(403).sendFile(path.resolve(__dirname + '/../public/html/403.html'));
	models.Class.findOne({
		where: {
			classCode: req.body.classCode
		}
	}).then(function(Class) {
		if (Class === null) return res.redirect('/dashboard');
		models.User.findOne({
			where: {
				username: req.session.user.username
			}
		}).then(function(user) {
			user.addClass(Class).then(function(data) {
				return res.redirect('/class/' + Class.classCode);
			});
		});
	});
};

exports.updateClass = function(req, res) {
	var classCode = req.params.classCode;
	models.Class.findOne({
		where: {
			classCode: classCode
		}
	}).then(function(Class) {
	});
}

exports.classPage = function(req, res) {
	models.Class.findOne({
		where: {
			classCode: req.params.classCode
		}
	}).then(function(Class) {
		Class.getPosts().then(function(posts) {
			(function recursePosts(i) {
				if (i === posts.length) {
					return res.render(__dirname + '/../views/class', {
						user: req.session.user,
						Class: Class,
						posts: posts
					});
				}
				models.User.findOne({
					where: {
						id: posts[i].dataValues.UserId
					}
				}).then(function(user) {
					posts[i].dataValues.User = user;
					models.Post.findOne({
						where: {
							id: posts[i].dataValues.id
						}
					}).then(function(post) {
						post.getComments().then(function(comments) {
							posts[i].dataValues.Comments = comments;
							(function recurseComments(j) {
								if (j === posts[i].dataValues.Comments.length) {
									return recursePosts(i+1);
								}
								models.User.findOne({
									where: {
										id: posts[i].dataValues.Comments[j].dataValues.UserId
									}
								}).then(function(commentor) {
									posts[i].dataValues.Comments[j].dataValues.User = commentor;
									recurseComments(j+1);
								})
							})(0);
						});
					});
				});
			})(0);
		});
	});
}