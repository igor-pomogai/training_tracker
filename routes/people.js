var User = require('tt/models/user').User;
var log = require('tt/libs/log')(module);

exports.getPeople = function(req, res, next) {
	var currentUserId = req.session.user;
	var isFriend = false;
	var friendsIds = [];
	var user;

	//updatePeopleWithLatestFields(next);

	User
		.findOne({	_id: currentUserId }, function(err, currentUser) {
			if (err) return next(err);
			
			currentUser.friends.forEach(function(friend) {
				friendsIds.push(friend.userId);
			});
		
			User
				.find({})
				.where('_id')
				.nin(friendsIds)
				.exec(function(err, users) {
					if (err) return next(err);

					var usersToSend = [];
					for (var i = 0; i < users.length; i++) {
						user = users[i];
						if (user._id.equals(currentUserId)) continue;

						usersToSend.push({
							username: user.username,
							name: user.firstname + ' ' + user.lastname,
							userId: user._id
						});
					};

					res.json(usersToSend);
				});
		});
};

exports.get = function(req, res) {
	res.render('people');
};

exports.addFriend = function(req, res, next) {
	var currentUserId = req.session.user;

	User.findOne({ _id: currentUserId}, function(err, currentUser) {
			if (err) return next(err);

			if (currentUser === null) return next('not signed in');

			User.findOne({
				_id: req.body.userId
			}, function(err, friend) {
				if (err) return next(err);

				currentUser.addFriend(friend.username, friend._id);

				currentUser.save(function(err) {
					if (err) return next(err);

					res.send(true);
				});
			});
		});
};

function updatePeopleWithLatestFields(next) {
	User
		.find({})
		.exec(function(err, users) {
			users.forEach(function(user) {
				user.set ('friends', []);
				user.set('country', 'Ukraine');
				user.set('city', 'Lviv');
				user.set('weight', []);
				user.set('height', 0);
				user.set('armSize', []);
				user.set('chestSize', []);
				user.set('pushWeight', []);

				user.save(function(err) {
					if (err) return next(err);
				});
			});
		});
}