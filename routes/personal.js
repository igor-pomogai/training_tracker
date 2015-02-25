var Visit = require('models/visit').Visit;
var log = require('libs/log')(module);

exports.get = function(req, res) {
	//console.log(req.session);
	//console.log(res.locals);

	res.render('personal');
};

exports.post = function(req, res) {
	var today = new Date();	
	var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	Visit.findOne({userId: req.session.user, visitDate: todayDate}, function(err, loadedVisit) {
		if (err) log.info(err);

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

		if (req.body.runVisit) {
			log.info('Was running today');
			req.session.visitedRun = req.visitedRun = res.locals.visitedRun = true;
			
			visit.running = [];
			visit.running.push({});
			responceVisitArray.push('running');
		} else {
			req.session.visitedRun = req.visitedRun = res.locals.visitedRun = false;
			visit.running = [];
		}

		if (req.body.gymVisit) {
			log.info('Visited gym');
			req.session.visitedGym = req.visitedGym = res.locals.visitedGym = true;
			
			visit.gymVisits = [];
			visit.gymVisits.push({});
			responceVisitArray.push('gym');
		} else {
			req.session.visitedGym = req.visitedGym = res.locals.visitedGym = false;
			visit.gymVisits = [];
		}

		if (req.body.poolVisit) {
			log.info('Visited pool');
			req.session.visitedPool = req.visitedPool = res.locals.visitedPool = true;
			
			visit.poolVisits = [];
			visit.poolVisits.push({});
			responceVisitArray.push('pool');
		} else {
			req.session.visitedPool = req.visitedPool = res.locals.visitedPool = false;
			visit.poolVisits = [];
		}

		visit.save(function(err) {
			if (err) console.log(err);

			log.info('Visit saved!');

			res.send(responceVisitArray);
		});


	});
};