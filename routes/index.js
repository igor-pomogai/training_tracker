var checkAuth = require('tt/middleware/checkAuth');
var loadVisit = require('tt/middleware/loadVisit');
var loadTrainingWeek = require('tt/middleware/loadTrainingWeek');
var loadNews = require('tt/middleware/loadNews');

module.exports = function(app) {
	
	/*
	 * API
	 */
	app.get('/users/:userId', checkAuth, require('./users').getById);
	app.get('/users/name/:name', require('./users').getByName); //just for development! 
	
	app.get('/users/:userId/activities', require('./users').getActivityByUser);
	app.post('/users/:userId/activities', require('./users').setUserActivity);
	app.delete('/users/:userId/activities', require('./users').removeUserActivity);
	
	app.get('/activities', require('./activities').getAll);



/*
	app.get('/', require('./frontpage').get);
	
	app.get('/personal', checkAuth, loadVisit, loadTrainingWeek, require('./personal').get);

	app.get('/visits', require('./visits').getVisits);
	app.post('/visits', require('./personal').post);	

	app.get('/profile/:userId', checkAuth, require('./profile').render);
	app.get('/profile/:userId/edit', checkAuth, require('./profile').edit);

	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);

	app.post('/logout', require('./logout').post);

	app.get('/news/latest', checkAuth, require('./latestNews').getLatest);

	app.get('/friends', checkAuth, require('./users').get);
	app.post('/users/approve', checkAuth, require('./users').approve);
	app.put('/users', checkAuth, require('./users').edit);
	app.delete('/users', checkAuth, require('./users').remove);
	
	app.delete('/visits/:userId/:activityId', require('./users').removeVisit);
	app.get('/visits/:userId', require('./users').get);
	app.post('/visits/:userId', require('./users').addVisits);
	
	app.get('users/:userId/visits/month', require('./users').getVisitsForMonth);
	app.get('users/:userId/visits/period', require('./users').getVisitsForPeriod);

	//app.get('users/:userId/friends', require('./users').getForMonth);

	app.get('/people', checkAuth, require('./people').get);
	app.get('/people/all', checkAuth, require('./people').getPeople);
	app.post('/friends/add', checkAuth, require('./people').addFriend);

	app.get('/register', require('./register').get);
	app.post('/register', require('./register').post);

	app.get('/admin', checkAuth, require('./admin').get);
	app.get('/admin/data', checkAuth, require('./admin').getData);
	
	app.get('/activities/:userId', checkAuth, require('./activities').getByUser);	
	app.post('/activities/:userId', checkAuth, require('./activities').saveByUser);	
	app.post('/activities/:userId/:activityId', checkAuth, require('./activities').removeByUser);	
	
	app.post('/activities/', checkAuth, require('./activities').createNew);	
*/

};