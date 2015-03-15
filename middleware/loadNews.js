var News = require('models/news').News;
var log = require('libs/log')(module);

module.exports = function (req, res, next) {
	News
		.find({})
		.limit(10)
		.sort('-newsDate')
		.exec(function(err, loadedNews) {
			var newsToSend = [];
			loadedNews.forEach(function(news) {
				newsToSend.push({
					newsDate: news.newsDate,
					newsBody: news.newsBody
				});
			});
			req.session.topNews = res.locals.topNews = newsToSend;

			next();
		});
};