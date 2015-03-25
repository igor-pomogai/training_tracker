var User = require('models/user').User;
var async = require('async');
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	res.render('login');
};

exports.post = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.authorize(username, password, function(err, user) {
		if (err) {
			if (err instanceof AuthError) {
				return next(new HttpError(403, err.message));
			} else {
				return next(err);
			}
		}
		
		log.info('User id: ' + user._id);
		log.info('User object: ' + user);
		req.session.user = user._id;
		res.redirect('/personal');
	});
};