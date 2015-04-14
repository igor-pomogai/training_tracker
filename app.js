var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');

var log = require('tt/libs/log')(module);
var mongoose = require('tt/libs/mongoose');
var config = require('tt/config');
var HttpError = require('tt/error').HttpError;
var AuthError = require('tt/models/user').AuthError;


var app = express();

app.engine('ejs', require('ejs-locals')); //layout partial block
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'ejs');

//app.use(express.favicon());
if (app.get('env') == 'development') {
	app.use(morgan('dev'));	
} else {
	app.use(morgan('tiny'));
}

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json 
app.use(bodyParser.json())
app.use(cookieParser()); //req.cookies...

//var MongoStore = require('connect-mongo')(express);
//app.use(app.router);
var MongoStore = require('connect-mongo')(session);
var sessionMiddleware = session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	store: new MongoStore({mongoose_connection: mongoose.connection})	
});
app.use(sessionMiddleware);

app.use(require('tt/middleware/sendHttpError'));
app.use(require('tt/middleware/sendAuthError'));
app.use(require('tt/middleware/loadUser'));

require('tt/routes')(app);

//app.use(express.static(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'public'), {}));

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

var server = http.createServer(app).listen(config.get('port'), function() {
	log.info('Express server listening on port ' + config.get('port'));
});

require('tt/socket')(server, sessionMiddleware);
