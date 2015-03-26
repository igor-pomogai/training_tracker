var User = require('models/user').User;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	User
		.find({})
		.exec(function(err, users) {
			if (err) throw new Error(err);

			var usersToSend = [];
			users.forEach(function(user) {
				usersToSend.push({
					username: user.username
				});
			});
			res.json(usersToSend);
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