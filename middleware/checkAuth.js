var HttpError = require('tt/error').HttpError;
var AuthError = require('tt/models/user').AuthError;

module.exports = function(req, res, next) {
	if (!req.session.user) {
		return next(new AuthError("You'r not authorized"));
	}

	next();
};