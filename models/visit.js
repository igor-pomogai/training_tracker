var async = require('async');
var util = require('util');

var mongoose = require('libs/mongoose'),
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
	gymVisits: [gymVisitSchema]
});

exports.Visit = mongoose.model('Visit', visitSchema);