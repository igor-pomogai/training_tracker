var mongoose = require('mongoose');
var config = require('tt/config');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;