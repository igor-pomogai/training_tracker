var User = require('tt/models/user').User;
var HttpError = require('tt/error').HttpError;
var AuthError = require('tt/models/user').AuthError;
var log = require('tt/libs/log')(module);

exports.get = function(req, res) {
	res.render('admin');
};

exports.getData = function(req, res) {
	User.find({}, function(err, users) {
		if (err) console.log(err);

		res.send(users);
	});
};