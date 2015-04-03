var crypto = require('crypto');
var async = require('async');
var util = require('util');
var log = require('libs/log')(module);

var mongoose = require('libs/mongoose'),
	Schema = mongoose.Schema,
	userGroupTypes = {
		values: 'admin user guest'.split(' '),
		message: 'No such user group'
	};

var ObjectId = mongoose.Schema.Types.ObjectId;

var userGroupSchema = new Schema({
	name: {
		type: String, 
		enum: userGroupTypes,
		default: 'user'	
	} 
});

var userFriendsSchema = new Schema({
	username: String,
	userId: ObjectId
});

var schema = new Schema({
	username: {
		type: String,
		unique: true, //mongoose creates index
		required: true
	},
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	email: {
		type: String
	},
	birthDate: {
		type: Date
	},
	approved: {
		type: Boolean,
		default: false
	},
	userGroup: [userGroupSchema],
	friends: [userFriendsSchema],

	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	created:  {
		type: Date,
		default: Date.now
	},

	country: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},

	weight: [new Schema({
		value: {
			type: Number,
			required: true,
			default: 0
		},
		date: {
			type: Date,
			required: true,
			default: Date.now
		}
	})],
	height: {
		type: Number,
		required: true,
		default: 0
	},
	armSize: [new Schema({
		value: {
			type: Number,
			required: true,
			default: 0
		},
		date: {
			type: Date,
			required: true,
			default: Date.now
		}
	})],
	chestSize: [new Schema({
		value: {
			type: Number,
			required: true,
			default: 0
		},
		date: {
			type: Date,
			required: true,
			default: Date.now
		}
	})],

	pushWeight: [new Schema({
		value: {
			type: Number,
			required: true,
			default: 0
		},
		date: {
			type: Date,
			required: true,
			default: Date.now
		}
	})]
});

schema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
	.set(function(password) {
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.addFriend = function(username, friendId) {
	this.friends.push({
		username: username,
		userId: friendId
	});
};

schema.statics.authorize = function(username, password, callback) {
	var User = this;

	async.waterfall([
		function(callback) {
			User.findOne({username: username}, callback);
		},
		function(user, callback) {
			if (user) {
				if (user.checkPassword(password)) {
					//callback(null, user);
					user.approved ? callback(null, user) : callback(new AuthError("Sorry. User is not approved by admin yet."));
				} else {
					callback(new AuthError("Wrong password."));
				}
			} else {
				callback(new AuthError("User doesn't exist."));
			}
		}
	], callback);
};

schema.statics.register = function(data, callback) {
	var User = this;

	async.waterfall([
		function(callback) {
			log.info('Looking for user: ' + data.username);
			User.findOne({username: data.username}, callback);
		},
		function(user, callback) {
			if (user) {
				log.info('User "' + user.username + '" exists.');
				callback(new RegisterError("User with such username already exists."))
			} else {
				var user = new User({
					username: data.username, 
					password: data.password, 
					firstname: data.firstname,
					lastname: data.lastname,
					email: data.email,
					birthDate: new Date(data.birthYear, data.birthMonth, data.birthDate)
				});

				log.info('User registered: ' + user.username);

				user.save(function(err) {
					if (err) return callback(err);
					
					callback(null, "User registered succcessfully. Wait for approval to login.");
				});	
			}
		}
	], callback);

};

exports.User = mongoose.model('User', schema);


function AuthError(message) {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, AuthError);

	this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = "AuthError";

exports.AuthError = AuthError;

function RegisterError(message) {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, AuthError);

	this.message = message;
}

util.inherits(RegisterError, Error);

RegisterError.prototype.name = "RegisterError";

exports.RegisterError = RegisterError;