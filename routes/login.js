var async = require('async');

var User = require('tt/models/user').User;
var HttpError = require('tt/error').HttpError;
var AuthError = require('tt/models/user').AuthError;
var log = require('tt/libs/log')(module);

exports.get = function(req, res) {
	res.render('login');
};

exports.post = function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.authorize(username, password, function(err, user) {
		if (err) {
			if (err instanceof AuthError) {
				return next(new AuthError(err.message, 403));
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