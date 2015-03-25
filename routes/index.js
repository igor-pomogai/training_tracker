var checkAuth = require('middleware/checkAuth');
var loadVisit = require('middleware/loadVisit');
var loadTrainingWeek = require('middleware/loadTrainingWeek');
var loadNews = require('middleware/loadNews');

module.exports = function(app) {
	
	app.get('/', require('./frontpage').get);

	app.get('/personal', checkAuth, loadVisit, loadTrainingWeek, require('./personal').get);

	app.post('/visit', require('./personal').post);

	app.get('/login', require('./login').get);

	app.post('/login', require('./login').post);

	app.post('/logout', require('./logout').post);

	
	app.get('/latestNews', require('./latestNews').get);

	app.get('/loadFriends', require('./users').get);

	app.get('/loadVisits', require('./visits').get);

	app.get('/register', require('./register').get);
	app.post('/register', require('./register').post);

	app.get('/admin', require('./admin').get);
	
};