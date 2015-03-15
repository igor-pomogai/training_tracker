var log = require('libs/log')(module);
var	News = require('models/news').News;
var User = require('models/user').User;

module.exports = function(server, sessionMiddleware) {
	var io = require('socket.io').listen(server);
	io.set('origins', 'localhost:*');
	io.set('logger', log);

	io.use(function(socket, next) {
	    sessionMiddleware(socket.request, socket.request.res, next);
	});

	io.sockets.on('connection', function (socket) {

		socket.on('newVisit', function (newsType, cb) {
			var today = new Date();	
			var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		  	News.findOne({userId: socket.request.session.user, newsDate: todayDate, newsType: newsType}, function(err, loadedNews) {
				if (err) log.info(err);

				console.log(loadedNews);
				
				if (loadedNews == null) {
					console.log(socket.request.session);
					User.findById(socket.request.session.user, function(err, user) {
						if (err) console.log(err);

						if (user) {

							var text;

							log.info('user found: ' + user.username);
							switch (newsType) {
								case 'gym_visit': 
									text = '<b>' + user.username + '</b> visited GYM';
									break;
								case 'pool_visit':
									text = '<b>' + user.username + '</b> visited POOL';
									break;
								case 'run_visit':
									text = '<b>' + user.username + '</b> was RUNNING';
									break;
							};

							var news = new News({
								userId: user._id,
								newsType: newsType,
								newsDate: todayDate,
								newsBody: text
							});

							news.save(function(err) {
								if (err) log.info(err);

								socket.broadcast.emit('newVisit', news);
									cb({
					    			exists: false,
					    			news: news
					    		});

								log.info('News saved.');
							});

							
				    		
						} else {
							log.info('user not found!');
						}
					});

					
				} else {
					cb({
						exists: true
					});
				}
				
			});
		});

		socket.on('getNews', function() {

		});
	});
};