var async = require('async');
var util = require('util');

var mongoose = require('tt/libs/mongoose'),
	Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var poolVisitSchema = new Schema({
	poolCount: {
		type: Number,
		default: 0
	},	
	timeSpent: {
		type: Number ,
		default: 0
	}
});

var runningSchema = new Schema({
	time: {
		type: Number,
		default: 0
	},
	distance: {
		type: Number,
		default: 0
	}
});

var gymVisitSchema = new Schema({
	description: {
		type: String,
		default: ""
	}
});

var visitSchema = new Schema({
	userId: {
		type: ObjectId,
		required: true
	},
	visitDate: {
		type: Date,
		required: true
	},
	poolVisits: [poolVisitSchema],
	running: [runningSchema],
	gymVisits: [gymVisitSchema],
	created:  {
		type: Date,
		default: Date.now
	},
	activity: ObjectId
});

visitSchema.index({userId: 1, visitDate: 1}, { unique: true});

exports.Visit = mongoose.model('Visit', visitSchema);