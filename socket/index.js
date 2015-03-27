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

		  	News.findOne({
		  		userId: socket.request.session.user, 
		  		newsDate: todayDate, 
		  		newsType: newsType}, function(err, loadedNews) {
				
				if (err) log.info(err);

				if (loadedNews == null) {
					console.log(socket.request.session);
					User.findById(socket.request.session.user, function(err, user) {
						if (err) console.log(err);

						if (user) {
							var text;

							log.info('user found: ' + user.username);

							var newsObj = new News({
								userId: user._id,
								newsType: newsType,
								newsDate: todayDate,
								username: user.username
							});

							newsObj.save(function(err) {
								if (err) log.info(err);
								
								var newsToSend = {
									date: newsObj.newsDate,
									body: newsObj.newsBody,
									user: newsObj.username,
									newsType: newsObj.newsType
								};

								socket.broadcast.emit('newVisit', newsToSend);
									cb({
					    			exists: false,
					    			news: newsToSend
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