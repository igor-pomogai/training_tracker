var User = require('models/user').User;
var log = require('libs/log')(module);

exports.getPeople = function(req, res) {
	var currentUserId = req.session.user;
	var isFriend = false;
	var friendsIds = [];
	var user;

	//updatePeopleWithLatestFields();

	User
		.findOne({	_id: currentUserId }, function(err, currentUser) {
			if (err) return new Error(err);

			log.info('friends: ');
			console.log(currentUser.friends);

			log.info('friends ids: ');
			
			currentUser.friends.forEach(function(friend) {
				
				console.log(friend.userId);

				friendsIds.push(friend.userId);
			});
			
			/*
			currentUser.friends = [];
			currentUser.save(function(err) {
				if (err) res.send(err);
			*/
				User
					.find({})
					.where('_id')
					.nin(friendsIds)
					.exec(function(err, users) {
						if (err) throw new Error(err);

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
			/*
			});
			*/


		});
};

exports.get = function(req, res) {
	res.render('people');
};

exports.addFriend = function(req, res) {
	var currentUserId = req.session.user;

	User.findOne({ _id: currentUserId }, function(err, currentUser) {
			if (err) return new Error(err);

			User.findOne({
				_id: req.body.userId
			}, function(err, friend) {
				currentUser.addFriend(friend.username, friend._id);

				currentUser.save(function(err) {
					if (err) return new Error(err);

					log.info('User: ' 
						+ currentUser.username 
						+ ' added a friend - ' 
						+ friend.username + '!');

					res.send(true);
				});
			});
		});
};

function updatePeopleWithLatestFields() {
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
					if (err) log.error('error updating user: ' + user,username);

					log.info('user : ' + user.username + ' info updated!');
				});

			});
		});
}