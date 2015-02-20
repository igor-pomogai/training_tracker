var winston = require('winston');
var ENV = process.env.NODE_ENV; 

function getLogger(module) {
	//console.log(ENV); ENV - undefined why???
	var path = module.filename.split('/').slice(-2).join('/');

	return new winston.Logger({
		transports: [
			new winston.transports.Console({
				colorize: true,
				level: 'debug',
				label: path
			})
		]
	});
}

module.exports = getLogger;