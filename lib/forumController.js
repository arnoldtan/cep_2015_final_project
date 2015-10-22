"use strict";

var models = require('../models');

exports.addPost = function(req, res) {
	if (req.body.content.split(' ').join('').length === 0) return res.redirect('/class/' + req.body.classCode);
	models.User.findOne({
		where: {
			username: req.session.user.username
		}
	}).then(function(user) {
		models.Class.findOne({
			where: {
				classCode: req.body.classCode
			}
		}).then(function(Class) {
			models.Post.create({
				content: req.body.content
			}).then(function(post) {
				Class.addPost(post).then(function() {
					user.addPost(post).then(function() {
						return res.redirect('/class/' + req.body.classCode + '#p' + post.dataValues.id);
					});
				});
			})
		});
	});
};

exports.deletePost_ajax = function(req, res) {
	models.Post.findOne({
		where: {
			id: req.params.postId
		}
	}).then(function(post) {
		if (post.UserId !== req.session.user.id) return res.status(403).end();
		models.Post.destroy({
			where: {
				id: req.params.postId
			}
		}).then(function() {
			return res.status(200).end('Post deleted successfully');
		});
	});
}

exports.updatePost_ajax = function(req, res) {
	if (req.body.content.split(' ').join('').length === 0) return res.status(400).end();
	models.Post.findOne({
		where: {
			id: req.params.postId
		}
	}).then(function(post) {
		if (post.UserId !== req.session.user.id) return res.status(403).end();
		models.Post.update({
			content: req.body.content
		}, {
			where: {
				id: req.params.postId
			}
		}).then(function() {
			return res.status(200).end('Post edited successfully');
		});
	});
}

exports.addComment = function(req, res) {
	if (req.body.content.split(' ').join('').length === 0) return res.redirect('/class/' + req.body.classCode + '#' + req.body.postId);
	models.Class.findOne({
		where: {
			classCode: req.body.classCode
		}
	}).then(function(Class) {
		models.Post.findOne({
			where: {
				id: req.body.postId,
				classId: Class.dataValues.id
			}
		}).then(function(post) {
			models.Comment.create({
				content: req.body.content
			}).then(function(comment) {
				post.addComment(comment).then(function() {
					models.User.findOne({
						where: {
							username: req.session.user.username
						}
					}).then(function(user) {
						user.addComment(comment);
						return res.redirect('/class/' + req.body.classCode + '#p' + req.body.postId);
					});
				});
			});
		});
	});
}

exports.deleteComment_ajax = function(req, res) {
	models.Comment.findOne({
		where: {
			id: req.params.commentId
		}
	}).then(function(comment) {
		if (comment.UserId !== req.session.user.id) return res.status(403).end();
		models.Comment.destroy({
			where: {
				id: req.params.commentId
			}
		}).then(function() {
			return res.status(200).end('Comment deleted successfully');
		});
	});
}

exports.updateComment_ajax = function(req, res) {
	if (req.body.content.split(' ').join('').length === 0) return res.status(400).end();
	models.Comment.findOne({
		where: {
			id: req.params.commentId
		}
	}).then(function(comment) {
		if (comment.UserId !== req.session.user.id) return res.status(403).end();
		models.Comment.update({
			content: req.body.content
		}, {
			where: {
				id: req.params.commentId
			}
		}).then(function() {
			return res.status(200).end('Comment edited successfully');
		});
	});
}