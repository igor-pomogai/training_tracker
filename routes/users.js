var User = require('tt/models/user').User;
var Activity = require('tt/models/activity').Activity;
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

exports.getByName = function(req, res) {
	var name = req.params.name;
	
	log.info('get user by id: ' + name);

	User
		.find({username: name})
		.exec(function(err, result) {
			if (err) return res.json(false);

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

exports.getFriends = function(req, res) {
	var userId = req.params.userId;

	User.findOne({_id: userId})
		.exec(function(err, user) {
			if (err) return res.json(false);

			var ids = [];

			console.log(userId);

			user.friends.forEach(function(friend) {
				ids.push(friend.userId);
			});

			console.log(ids);

			User
				.where('_id').in(ids)
				.exec(function(err, people) {
					if (err) return res.json(false);

					console.log(people);

					res.json(people);
				});

		});

};

exports.addFriend = function(req, res) {
	var userId = req.params.userId;
	var friendId = req.params.friendId;

	console.log('Adding friend.');

	User.findOne({_id: userId})
		.exec(function(err, user) {
			if (err) res.json(false);

			console.log('user found: ' + user.username);

			User.findOne({_id: friendId})
				.exec(function(err, friend) {
					if (err) res.json(false);

					console.log('friend found: ' + friend.username);

					user.addFriend(friend.username, friend._id, false);
					console.log('friend added to user: ' + user.username);
					friend.addFriend(user.username, user._id, true);
					console.log('friend request sent to: ' + friend.username);

					user.save(function(err) {
						if (err) res.json(false);

						console.log('friend save success');

						friend.save(function(err) {
							if (err) res.json(false);
							
							console.log('friend request send success');

							res.json(true);
						});
					});

				});
		});
};

exports.removeFriend = function(req, res) {
	var userId = req.params.userId;
	var friendId = req.params.friendId;

	User.findOne({_id: userId})
		.exec(function(err, user) {
			if (err) res.json(false);

			for (var i = 0; i < user.friends.length; i++) {
				if (user.friends[i].userId !== friendId) continue;

				user.friends[i].splice(i, 1); break;
			}

			User.findOne({_id: friendId})
				.exec(function(err, friend) {
					if (err) res.json(false);

					for (var i = 0; i < friend.friends.length; i++) {
						if (friend.friends[i].userId !== userId) continue;

						friend.friends[i].splice(i, 1); break;
					}

					user.save(function(err) {
						if (err) res.json(false);

						friend.save(function(err) {
							if (err) res.json(false);

							res.json(true);
						});

					});

				});

		});
};

exports.acceptRequest = function(req, res) {
	var userId = req.params.userId;
	var friendId = req.params.friendId;


};

exports.generateTestVisits = function(req, res) {
	
	User.find({})
		.exec(function(err, users) {
			if (err) res.json(false);

			console.log('generating test visits..');
			console.log('-users found: ' + users.length);

			Activity.find({})
				.exec(function(err, activities) {
					if (err) res.json(false);

					console.log('-activities found: ' + activities.length);

					async.each(
						users, 
						function(user, callback) {

							console.log('--working with user: ' + user.username);

							console.log('---checking if user have activities..');

							if (user.activities.length == 0) {

								console.log('---no activities found, will generate');

								for (var j = 0; j < activities.length; j++) {
									user.activities.push({
										actId: activities[j]._id,
										title: activities[j].title
									});
								}

							} else {
								console.log('---user have activities');
							}

							for (var i = 0; i < 10; i++) {
								var today = new Date(),
									monthStart = new Date();

								monthStart.setDate(1);
								monthStart.setHours(0,0,0,0);

								console.log('---generating random date..');
								console.log('---today [' + +today + ' ms]: ' + today);
								console.log('---month start [' + +monthStart + ' ms]: ' + monthStart);

								var randomDateTimestamp = Math.floor(
										Math.random() 
										* (+today - +monthStart) 
										+ +monthStart
									);
								var randomDate = new Date(randomDateTimestamp);

								console.log('---random date: ' + randomDate);

								var randomActivityIndex = Math.floor(Math.random() * user.activities.length);

								console.log('---random activity ID: ' + user.activities[randomActivityIndex]._id);

								var visitObj = {
									activityId: user.activities[randomActivityIndex].actId,
									visitDate: randomDate
								};

								user.visits.push(visitObj);
								
							}

							user.save(function(err) {
								if (err) return callback(err);

								callback();
							});

						},
						function(err) {
							if (err) res.json(false);

							console.log('finished!');

							res.json(users);
						});
				});

			
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

/*
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
*/