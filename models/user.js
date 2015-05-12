var crypto = require('crypto');
var async = require('async');
var util = require('util');

var log = require('tt/libs/log')(module);

var mongoose = require('tt/libs/mongoose'),
	Schema = mongoose.Schema,
	userGroupTypes = {
		values: 'admin user guest'.split(' '),
		message: 'No such user group'
	};

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({

	/**
	 * User main info
	 */
	username: {
		type: String,
		unique: true, //mongoose creates index
		required: true
	},

	firstname: String,
	lastname: String,
	email: String,
	birthDate: Date,

	/**
	 * Indicates whether user is APPROVED by administrator for using the system
	 */
	approved: {
		type: Boolean,
		default: false
	},

	/**
	 * User roles array
	 */
	userGroup: [{
		name: {
			type: String, 
			enum: userGroupTypes,
			default: 'user'	
		} 
	}],

	/**
	 * Users friends array
	 */
	friends: [{
		username: String,
		userId: ObjectId
	}],

	/**
	 * Password fields
	 */
	hashedPassword: {
		type: String,
		required: true
	},

	salt: {
		type: String,
		required: true
	},

	/**
	 * Indicates when the user was created
	 */
	created:  {
		type: Date,
		default: Date.now
	},

	/**
	 * User location
	 */
	country: {
		type: String,
		required: true,
		default: ' '
	},

	city: {
		type: String,
		required: true,
		default: ' '
	},

	/**
	 * User body metrics and sport results
	 */
	weight: [{
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
	}],

	height: {
		type: Number,
		required: true,
		default: 0
	},

	armSize: [{
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
	}],

	chestSize: [{
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
	}],

	pushWeight: [{
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
	}],

	/**
	 * List of activities user is visiting
	 */
	activities: [{
		title: String,
		actId: ObjectId
	}], 

	/**
	 * List of user activity visiting
	 */
	visits: [{
		created: {
			type: Date,
			default: Date.now
		},
		activityId: ObjectId,
		visitDate: Date,
		description: {
			type: String,
			default: ' '
		}
	}]
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

schema.statics.addVisits = function(userId, visitsArray, callback) {
	var User = this;

	User.findOne({ _id: userId }, function(err, user) {
		if (err) return callback(err);

		visitsArray.forEach(function(visit) {
			var today = new Date(),	
				todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
			
			var visitObj = {
				activityId: visit,
				visitDate: todayDate
			};

			user.visits.push(visitObj);
		});

		user.save(function(err) {
			if (err) return callback(err);

			callback(null);
		});
	});
};

schema.statics.removeVisit = function(userId, activityId, callback) {
	var User = this;

	User.findOne({ _id: userId }, function(err, user) {
		if (err) return callback(err);

		for (var i = 0; i < user.visits.length; i++) {
		
			var today = new Date(),	
				todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
			
			var visitDate = new Date(user.visits[i].visitDate);

			if (visitDate.getTime() !== todayDate.getTime()) continue;

			if (!user.visits[i].activityId.equals(activityId)) continue;

			console.log(user.visits);

			user.visits.splice(i, 1);

			user.save(function(err) {
				if (err) return callback(err);

				console.log(user.visits);

				callback(null);
			});

			break;
		}

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
					user.approved ? 
						callback(null, user) 
						: callback(new AuthError("Sorry. User is not approved by admin yet."));
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
					birthDate: new Date(data.birthYear, data.birthMonth, data.birthDate),
					country: ' ',
					city: ' '
				});
				user.userGroup.push({});

				console.log('country: ' + user.country + '\ncity: ' + user.city);

				user.save(function(err) {
					if (err) return callback(new AuthError(err));
					
					callback(null, "User registered succcessfully. Wait for approval to login.");
				});	
			}
		}
	], callback);

};

function workingWithDate() {
	
	// Array of day names
	var dayNamesEN = ["Sunday","Monday","Tuesday","Wednesday",
		"Thursday","Friday","Saturday"];
	var dayNamesRUS = ["Monday","Tuesday","Wednesday","Thursday",
		"Friday","Saturday","Sunday"];

	// Array of month Names
	var monthNames = ["January","February","March","April","May",
		"June","July","August","September","October","November","December"];

	var now = new Date();

	var dateString = dayNames[now.getDay()] + ", " + 
		monthNames[now.getMonth()] + " " + 
		now.getDate() + ", " + now.getFullYear();

}

exports.User = mongoose.model('User', schema);

function AuthError(message, status) {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, AuthError);

	this.message = message;
	this.status = status || 200;
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