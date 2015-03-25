var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	res.render('register');
};

exports.post = function(req, res) {
	log.info('registration');	
	
	User.register(req.body, function(err, message) {
		if (err) {
			if (err instanceof AuthError) {
				return next(new HttpError(403, err.message));
			} else {
				return next(err);
			}
		}

		res.json(message);
	});
};