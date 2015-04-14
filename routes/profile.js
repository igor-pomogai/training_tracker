var User = require('tt/models/user').User;
var	log = require('tt/libs/log')(module);
var HttpError = require('tt/error').HttpError;

exports.render = function(req, res, next) {
	log.info('get profile page.');

	if (req.query.userId) {
		log.info('open profile page with user: ' + req.query.userId);
		console.log(req.query.userId);
		User
			.findById(req.query.userId)
			.exec(function(err, user) {
				if (err) return next(new HttpError(500, err.message));
				
				console.log('loaded user: ' + user._id);
				
				console.log('sesssion user: ' + req.session.user);
				req.canEdit = res.locals.canEdit = (user._id.equals(req.session.user));

				res.render('profile', {
					selectedUser: user
				});
			});

	} else {
		log.info('open profile of current user.');
		//req.selectedUser = res.locals.selectedUser = req.user;
		req.canEdit =  res.locals.canEdit = true;
		res.render('profile', {
			selectedUser: req.user
		});
	}
	
};

exports.getProfile = function(req, res, next) {
 	if (req.query.userId) {
		log.info('open profile page with user: ' + req.query.userId);
		console.log(req.query.userId);
		User
			.findById(req.query.userId)
			.exec(function(err, user) {
				if (err) return next(new Error(err));
				
				console.log(user);
				req.selectedUser = res.locals.selectedUser = user;
				req.canEdit = res.locals.canEdit = false;

				res.render('profile');
			});

	} else {
		log.info('open profile of current user.');
		req.selectedUser = res.locals.selectedUser = req.user;
		req.canEdit =  res.locals.canEdit = true;
		res.render('profile');
	}
};

exports.edit = function(req, res) {
	res.render('profileEdit');
};