var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	res.render('admin');
};