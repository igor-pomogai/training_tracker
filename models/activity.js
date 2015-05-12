var User = require('tt/models/user').User;
var log = require('tt/libs/log')(module);

var mongoose = require('tt/libs/mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Schema.Types.ObjectId;

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

	var activityPool = new Activity({
		title: 'pool',
		coeff: 0.5,
		approved: true
	});
	activityPool.save(function() {
		var activityRun = new Activity({
			title: 'run',
			coeff: 0.5,
			approved: true
		});
		activityRun.save(function() {
			var activityGym = new Activity({
				title: 'gym',
				coeff: 1.0,
				approved: true
			});
			activityGym.save(function() {
				var activityPool = new Activity({
					title: 'pool',
					coeff: 0.5,
					approved: true
				});
				activityPool.save(function() {
					var activityFootball = new Activity({
						title: 'football',
						coeff: 1.0,
						approved: true
					});
					activityFootball.save(callback);
				});
			});
		});
	});		
};

exports.Activity = mongoose.model('Activity', schema);