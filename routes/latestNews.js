var News = require('models/news').News;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	News
		.find({})
		.limit(10)
		.sort('-created')
		.exec(function(err, loadedNews) {
			if (err) throw new Error(err);

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
		/*
	News
		.find({})
		.sort({newsDate : -1})
		.limit(10)
		.exec(function(err, loadedNews) {
			var newsToSend = [];
			var newsToSendObj = {};
			loadedNews.forEach(function(news) {
				newsToSend.push({
					newsDate: news.newsDate,
					newsBody: news.newsBody,
					userId: news.userId
				});
			});
			res.json(newsToSend);
		});
*/
};