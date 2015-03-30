var User = require('models/user').User;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	User
		.find({})
		.exec(function(err, users) {
			if (err) throw new Error(err);

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
};

exports.getById = function(req, res) {
	console.log(req.query.userId);
	User
		.findById(req.query.userId)
		.exec(function(err, user) {
			if (err) throw new Error(err);
			//log.info('user found: ' + user.username);
			console.log(user);
			res.json(user);
		});
};

exports.approve = function(req, res) {
	User
		.findById(req.body.usrId)
		.exec(function(err, user) {
			if (err) throw new Error(err);

			user.approved = true;

			user.save(function(err) {
				if (err) throw new Error(err);

				log.info('user approved: ' + user.username);
				res.send(true);
			});
		});
};

exports.remove = function(req, res) {
	User
		.find({_id: req.body.usrId})
		.remove()
		.exec(function(err) {
			if (err) throw new Error(err);

			res.send(true);
		});
};

exports.edit = function(req, res) {
	User
		.findById(req.session.user)
		.exec(function(err, user) {
			if (err) throw new Error(err);

			var date;

			user.firstname = req.body.firstname;
			user.lastname = req.body.lastname;
			user.email = req.body.email;

			user.birthDate = new Date(req.body.birthYear, req.body.birthMonth - 1, req.body.birthDate);

			user.save(function(err) {
				if (err) throw new Error(err);

				log.info('user updated: ' + user.username);
				res.send('User info updated.');
			});
		});	
};