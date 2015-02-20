var log = require('libs/log')(module);
var Visit = require('models/visit').Visit;

module.exports = function(req, res, next) {
	req.visitedGym = res.locals.visitedGym = false;
	req.visitedPool = res.locals.visitedPool = false;
	req.visitedRun = res.locals.visitedRun = false;

	Visit.findOne({userId: req.session.user}, function(err, visit) {
		if (err) return next(err);

		if (visit) {
			if (visit.poolVisits.length > 0) {
				req.visitedPool = res.locals.visitedPool = true;
			}

			if (visit.running.length > 0) {
				req.visitedRun = res.locals.visitedRun = true;
			}

			if (visit.gymVisits.length > 0) {
				req.visitedGym = res.locals.visitedGym = true;
			}
		}

		next();
	});
};