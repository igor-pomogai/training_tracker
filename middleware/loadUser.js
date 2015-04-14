var User = require('tt/models/user').User;
var log = require('tt/libs/log')(module);

module.exports = function(req, res, next) {
	req.user = res.locals.user = null;
	
	if (!req.session.user) return next();

	User.findById(req.session.user, function(err, user) {
		if (err) return next(err);

		req.user = res.locals.user = user;
		req.session.user = user._id;

		next();
	});
};