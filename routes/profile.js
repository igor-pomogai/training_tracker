var User = require('models/user').User;
var	log = require('libs/log')(module);

exports.get = function(req, res) {
	log.info('get profile page.');
	
	if (req.query.userId) {
		log.info('open profile page with user: ' + req.query.userId);
		console.log(req.query.userId);
		User
			.findById(req.query.userId)
			.exec(function(err, user) {
				if (err) throw new Error(err);
				
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
	
	
}

exports.edit = function(req, res) {
	res.render('profileEdit');
}