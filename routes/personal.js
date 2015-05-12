var HttpError = require('tt/error').HttpError,
	Visit = require('tt/models/visit').Visit,
	News = require('tt/models/news').News,
	log = require('tt/libs/log')(module),
	User = require('tt/models/user').User;

exports.get = function(req, res) {
	res.render('personal');
};

exports.post = function(req, res, next) {
	var today = new Date();	
	var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	Visit.findOne({userId: req.session.user, visitDate: todayDate}, function(err, loadedVisit) {
		if (err) return next(new HttpError(err.message));

		var visit,
			responceVisitArray = [];

		if (!loadedVisit) {
			log.info('no visits for today! creating new one!');
			visit = new Visit({
				userId: req.session.user,
				visitDate: todayDate
			});
		} else {
			log.info('todays visit exist! using it!');
			visit = loadedVisit;
		}

		req.session.visitedRun = req.visitedRun = res.locals.visitedRun = req.body.runVisit;
		visit.running = [];
		if (req.body.runVisit) {
			log.info('Was running today');
			
			visit.running.push({});
			responceVisitArray.push('run_visit');
		}

		req.session.visitedGym = req.visitedGym = res.locals.visitedGym = req.body.gymVisit;
		visit.gymVisits = [];
		if (req.body.gymVisit) {
			log.info('Visited gym');
			
			visit.gymVisits.push({});
			responceVisitArray.push('gym_visit');
		}

		req.session.visitedPool = req.visitedPool = res.locals.visitedPool = req.body.poolVisit;
		visit.poolVisits = [];
		if (req.body.poolVisit) {
			log.info('Visited pool');
			
			visit.poolVisits.push({});
			responceVisitArray.push('pool_visit');
		}

		visit.save(function(err) {
			if (err) return next(err);

			log.info('Visit saved!');

			res.send(responceVisitArray);
		});

		

	});
};