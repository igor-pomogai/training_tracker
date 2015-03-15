var News = require('models/news').News;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	News
		.find({})
		.sort({newsDate : -1})
		.limit(10)
		.exec(function(err, loadedNews) {
			var newsToSend = [];
			loadedNews.forEach(function(news) {
				newsToSend.push({
					newsDate: news.newsDate,
					newsBody: news.newsBody
				});
			});
			res.json(newsToSend);
		});
};