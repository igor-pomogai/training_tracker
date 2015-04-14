var checkAuth = require('tt/middleware/checkAuth');
var loadVisit = require('tt/middleware/loadVisit');
var loadTrainingWeek = require('tt/middleware/loadTrainingWeek');
var loadNews = require('tt/middleware/loadNews');

module.exports = function(app) {
	
	app.get('/', require('./frontpage').get);

	app.get('/personal', checkAuth, loadVisit, loadTrainingWeek, require('./personal').get);

	app.get('/visits', require('./visits').getVisits);
	app.post('/visits', require('./personal').post);	

	app.get('/profile', checkAuth, require('./profile').render);
	app.get('/profile/edit', checkAuth, require('./profile').edit);

	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);

	app.post('/logout', require('./logout').post);

	app.get('/news/latest', checkAuth, require('./latestNews').getLatest);

	app.get('/friends', checkAuth, require('./users').get);
	app.post('/users/approve', checkAuth, require('./users').approve);
	app.put('/users', checkAuth, require('./users').edit);
	app.delete('/users', checkAuth, require('./users').remove);

	app.get('/people', checkAuth, require('./people').get);
	app.get('/people/all', checkAuth, require('./people').getPeople);
	app.post('/friends/add', checkAuth, require('./people').addFriend);

	app.get('/register', require('./register').get);
	app.post('/register', require('./register').post);

	app.get('/admin', checkAuth, require('./admin').get);
	app.get('/admin/data', checkAuth, require('./admin').getData);
	
};