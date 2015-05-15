/*
 * set up
 */
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');

/*
 * local libs 
 */
var log = require('tt/libs/log')(module);
var mongoose = require('tt/libs/mongoose');
var config = require('tt/config');
var HttpError = require('tt/error').HttpError;
var AuthError = require('tt/models/user').AuthError;

/*
 * application initialization
 */
var app = express();

/*
 * view engine initialization 
 */
app.engine('ejs', require('ejs-locals')); //layout partial block
app.set('views', path.join(__dirname, '/templates')); //set path to templates
app.set('view engine', 'ejs'); //set the view engine

//app.use(express.favicon());

/*
 * logging mechanism init
 */
if (app.get('env') == 'development') {
	app.use(morgan('dev'));	
} else {
	app.use(morgan('tiny'));
}

/*
 * parse application/x-www-form-urlencoded 
 */
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * parse application/json 
 */ 
app.use(bodyParser.json())

/*
 * req.cookies...
 */
app.use(cookieParser());

/*
 * register static content folder
 */
app.use(serveStatic(path.join(__dirname, 'public'), {}));

/*
 * set up the database connection and models
 */
var MongoStore = require('connect-mongo')(session);
var sessionMiddleware = session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	store: new MongoStore({mongoose_connection: mongoose.connection})	
});
app.use(sessionMiddleware);

/*
 * middleware
 */
//app.use(require('tt/middleware/sendHttpError'));
//app.use(require('tt/middleware/sendAuthError'));
//app.use(require('tt/middleware/loadUser'));

/*
 * routes
 */
app.use('/', serveStatic(path.join(__dirname, 'public'), {}));
require('tt/routes')(app);

/*
 * error handling
 */
app.use(function(err, req, res, next) {
	log.error(err);

	if (typeof err == 'number') {
		err = new HttpError(err);
	}

	if (err instanceof HttpError) {
		res.sendHttpError(err);
	} else if (err instanceof AuthError) {
		res.sendAuthError(err);
	} else {
		if (app.get('env') == 'development') {
			errorhandler()(err, req, res, next);
		} else {
			log.error(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}
});

/*
 * server start
 */
var server = http.createServer(app).listen(config.get('port'), function() {
	log.info('Express server listening on port ' + config.get('port'));
});

/*
 * socket io usage
 */
require('tt/socket')(server, sessionMiddleware);
