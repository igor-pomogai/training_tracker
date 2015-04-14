var News = require('tt/models/news').News;
var log = require('tt/libs/log')(module);

exports.getLatest = function(req, res, next) {
	News
		.find({})
		.limit(10)
		.sort('-created')
		.exec(function(err, loadedNews) {
			if (err) return next(err);

			var newsToSend = [];
			loadedNews.forEach(function(news) {
				newsToSend.push({
					date: news.newsDate,
					body: news.newsBody,
					user: news.username,
					newsType: news.newsType
				});
			});
			req.session.topNews = res.locals.topNews = newsToSend;
			res.json(newsToSend);
		});
};