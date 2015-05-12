var User = require('tt/models/user').User;
var log = require('tt/libs/log')(module);
var async = require('async');

//remove this in a while
exports.get = function(req, res, next) {
	var friendsIds = [];

	User
		.findOne({
			_id: req.session.user
		}, 
		function(err, currentUser) {
			if (err) return next(err);

			if (currentUser.friends.length > 0) {
				currentUser.friends.forEach(function(friend) {
					friendsIds.push(friend.userId);
				});
			} else {
				log.info('sorry, ' + currentUser.username + ' you have no friends yet :( ');
			}

			User
				.find({})
				.where('_id')
				.in(friendsIds)
				.exec(function(err, users) {
					if (err) return next(err);

					var usersToSend = [];
					users.forEach(function(user) {
						if (!user._id.equals(req.session.user)) {
							usersToSend.push({
								username: user.username,
								userId: user._id
							});
						}
					});
					res.json(usersToSend);
				});
		});
};

exports.getById = function(req, res, next) {
	var userId = req.params.userId;
	
	log.info('get user by id: ' + userId);

	User
		.findById(userId)
		.exec(function(err, user) {
			if (err) return next(err);

			if (user) log.info('user found: ' + user.username);

			res.json(user);
			
		});
};

exports.approve = function(req, res, next) {
	User
		.findById(req.body.usrId)
		.exec(function(err, user) {
			if (err) return next(err);

			user.approved = true;

			user.save(function(err) {
				if (err) throw new Error(err);

				log.info('user approved: ' + user.username);
				res.send(true);
			});
		});
};

exports.remove = function(req, res, next) {
	User
		.find({_id: req.body.usrId})
		.remove()
		.exec(function(err) {
			if (err) return next(err);

			res.send(true);
		});
};

exports.edit = function(req, res, next) {
	User
		.findById(req.session.user)
		.exec(function(err, user) {
			if (err) return next(err);

			var date;

			user.firstname = req.body.firstname;
			user.lastname = req.body.lastname;
			user.email = req.body.email;

			user.birthDate = new Date(req.body.birthYear, req.body.birthMonth - 1, req.body.birthDate);

			user.save(function(err) {
				if (err) throw new Error(err);

				res.send('User info updated.');
			});
		});	
};

exports.addVisits = function(req, res, next) {
	var userId = req.params.userId,
		newActivities = [],	
		i,
		vars;

	console.log(req.body.formData);


	if (req.body && req.body.formData) {

		var vars = req.body.formData.split("&");
		
		for (i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			newActivities.push(pair[1]);
		}

	}

	User.addVisits(userId, newActivities, function(err) {
		if (err) return next(err);

		res.send(true); //maybe send something more usefull
	});

};

exports.removeVisit = function(req, res, next) {
	var userId = req.params.userId,
		activityId = req.params.activityId;

	console.log('removing: ' + activityId);

	User.removeVisit(userId, activityId, function(err) {
		if (err) return next(err);

		res.send(true);
	});

};

exports.getVisits = function(req, res, next) {

};

exports.getVisitsForMonth = function(req, res, next) {
	var userId = req.params.userId,
		today = new Date(),	
		todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	'/users/:userId/friends/visits'


};

exports.getVisitsForPeriod = function(req, res, next) {
	var userId = req.params.userId;	

};
