var User = require('models/user').User;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	User
		.find({})
		.exec(function(err, users) {
			var usersToSend = [];
			users.forEach(function(user) {
				usersToSend.push({
					username: user.username
				});
			});
			res.json(usersToSend);
		});
};