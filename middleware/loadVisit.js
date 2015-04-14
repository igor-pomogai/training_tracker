var log = require('tt/libs/log')(module);
var Visit = require('tt/models/visit').Visit;

module.exports = function(req, res, next) {
	req.visitedGym = res.locals.visitedGym = false;
	req.visitedPool = res.locals.visitedPool = false;
	req.visitedRun = res.locals.visitedRun = false;

	var today = new Date();	
	var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	Visit.findOne({userId: req.session.user, visitDate: todayDate}, function(err, visit) {
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