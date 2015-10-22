var models = require('../models');

module.exports = function(req, res) {
	models.User.findOne({
		where: {
			username: req.session.user.username
		}
	}).then(function(user) {
		user.getClasses().then(function (classes) {
			return res.render(__dirname + '/../views/dashboard', {
				user: req.session.user,
				classes: classes
			});
		});
	});
}