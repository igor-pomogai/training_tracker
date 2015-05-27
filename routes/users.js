var User = require('tt/models/user').User;
var log = require('tt/libs/log')(module);
var async = require('async');

exports.getAll = function(req, res) {
	User
		.find({})
		.exec(function(err, users) {
			if (err) return res.json(false);

			res.json(users);
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

exports.getByName = function(req, res, next) {
	var name = req.params.name;
	
	log.info('get user by id: ' + name);

	User
		.find({username: name})
		.exec(function(err, result) {
			if (err) return next(err);

			var user = result[0];

			if (user) log.info('user found: ' + user.username);

			/*user.visits = [];

			user.save(function(err) {
				if (err) return res.json(false);

				res.json(user);
			});*/

			res.json(user);
			
		});
};

exports.getActivityByUser = function(req, res, next) {

};

exports.setUserActivities = function(req, res, next) {
	var activities = req.body.activities,
		userId = req.params.userId;

	User.findById(userId)
		.exec(function(err, user) {
			if (err) return next(err);

			if (activities === undefined) return res.json(false);

			for (var i = 0; i < activities.length; i++) {
				user.activities.push({
					actId: activities[i].id,
					title: activities[i].title
				});
			}

			user.save(function(err) {
				if (err) return res.json(false);

				res.json(true);
			});

		});

};

exports.removeUserActivity = function(req, res, next) {
	var userId = req.params.userId,
		activityId = req.params.activityId;

	User.findById(userId, function(err, user) {
		if (err) return res.json(false);

		for (var i = 0; i < user.activities.length; i++) {
			if (user.activities[i].actId.equals(activityId)) {
				user.activities.splice(i, 1);
				break;
			}
		}

		user.save(function(err) {
			if (err) return res.json(false);

			res.json(true);
		});
	});
};

exports.saveVisits = function(req, res) {	
	var userId = req.params.userId;
	var activities = req.body.activities;

	User.addVisits(userId, activities, function(err) {
		if (err) return res.json(false);

		res.json(true);
	});

};

exports.removeVisit = function(req, res) {
	var userId = req.params.userId;
	var activityId = req.params.activityId;

	log.info('remove visit (from server)');

	User.removeVisit(userId, activityId, function(err) {
		if (err) return res.json(false);

		res.json(true);
	});

};

exports.registerUser = function(req, res) {

	log.info('registration');	

	var user = req.body.user;
	
	User.register(user, function(err, registeredUser) {
		if (err) return res.json(false);

		res.json(registeredUser);
	});

};


/*
 * Old api
 */


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

//remove this in a while
/*exports.get = function(req, res, next) {
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
};*/
