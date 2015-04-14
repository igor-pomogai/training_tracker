var User = require('models/user').User;
var log = require('libs/log')(module);
var ObjectId = mongoose.Schema.Types.ObjectId;

var mongoose = require('libs/mongoose'),
	Schema = mongoose.Schema,

var schema = new Schema({
	title: {
		type: String,
		unique: true,
		required: true
	},
	coeff: {
		type: Number,
		default: 1.0
	},
	approved: {
		type: Boolean,
		default: false
	}
});

schema.statics.createActivities = function(callback) {
	var Activity = this;
	var userSavedCallback = function(err) {
		if (err) return callback(err);
		
	};

	var activityPool = new Activity({
		title: 'pool',
		coeff: 0.5,
		approved: true
	});
	activityPool.save(userSavedCallback);

	var activityRun = new Activity({
		title: 'run',
		coeff: 0.5,
		approved: true
	});
	activityRun.save(userSavedCallback);

	var activityGym = new Activity({
		title: 'gym',
		coeff: 1.0,
		approved: true
	});
	activityGym.save(userSavedCallback);

	var activityPool = new Activity({
		title: 'pool',
		coeff: 0.5,
		approved: true
	});
	activityPool.save(userSavedCallback);
};

exports.Activity = mongoose.model('Activity', schema);