var express = require('express');
var http = require('http');
var path = require('path');
var log = require('libs/log')(module);
var config = require('config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var HttpError = require('error').HttpError;
var mongoose = require('libs/mongoose');
var errorhandler = require('errorhandler')

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
app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	store: new MongoStore({mongoose_connection: mongoose.connection})	
}));

app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));

require('routes')(app);

//app.use(express.static(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'public'), {}));

app.use(function(err, req, res, next) {
	if (typeof err == 'number') {
		err = new HttpError(err);
	}

	if (err instanceof HttpError) {
		res.sendHttpError(err);
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

require('socket')(server);
