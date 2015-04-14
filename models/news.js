var async = require('async');
var util = require('util');

var mongoose = require('tt/libs/mongoose'),
	Schema = mongoose.Schema;

var	ObjectId = mongoose.Schema.Types.ObjectId,
	newsTypes = {
		values: 'run_visit pool_visit gym_visit no_visit_for_week sick not_sick achieve_complete achieve_failed achieve_new'.split(' '),
		message: 'No such news type!'
	};

var newsSchema = new Schema({
	newsBody: {
		type: String,
		default: ''
	},	
	newsDate: {
		type: Date
	},
	userId: {
		type: ObjectId
	},
	newsType: {
		type: String,
		enum: newsTypes
	},
	username: {
		type: String,
		default: ''
	},
	created:  {
		type: Date,
		default: Date.now
	}
});

newsSchema.index({userId: 1, newsDate: 1, newsType: 1}, { unique: true});

exports.News = mongoose.model('News', newsSchema);