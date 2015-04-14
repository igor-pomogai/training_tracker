var User = require('tt/models/user').User;
var log = require('tt/libs/log')(module);

exports.get = function(req, res, next) {
	var friendsIds = [];

	User
		.findOne({
			_id: req.session.user
		}, function(err, currentUser) {
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
	User
		.findById(req.query.userId)
		.exec(function(err, user) {
			if (err) return next(err);

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