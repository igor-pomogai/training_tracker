var log = require('libs/log')(module);
var Visit = require('models/visit').Visit;

function createTestVisits(req) {
	var today = new Date();	
	var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	var oneDay = 24*60*60*1000;
	
	var visit = new Visit({
		userId: req.session.user,
		visitDate: new Date(today.getFullYear(), today.getMonth(), 18)
	});
	visit.running.push({});
	visit.poolVisits.push({});

	var visit1 = new Visit({
		userId: req.session.user,
		visitDate: new Date(today.getFullYear(), today.getMonth(), 17)
	});
	visit1.running.push({});
	visit1.gymVisits.push({});

	var visit2 = new Visit({
		userId: req.session.user,
		visitDate: new Date(today.getFullYear(), today.getMonth(), 16)
	});
	visit2.gymVisits.push({});
	visit2.poolVisits.push({});

	var visit3 = new Visit({
		userId: req.session.user,
		visitDate: new Date(today.getFullYear(), today.getMonth(), 15)
	});
	visit3.running.push({});
	visit3.gymVisits.push({});
	visit3.poolVisits.push({});

	var callback = function(err) {
		if (err) console.log(err);

		log.info('Visit saved!');
	};

	visit.save(callback);
	visit1.save(callback);
	visit2.save(callback);
	visit3.save(callback);
}

module.exports = function(req, res, next) {
	var today = new Date();

	log.info(today.getDay());

	switch (today.getUTCDay()) {
		case 0:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'mon';
			break;
		case 1:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'tue';
			break;
		case 2:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'wed';
			break;
		case 3:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'thu';
			break;
		case 4:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'fri';
			break;
		case 5:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'sat';
			break;
		case 6:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'sun';
			break;
		default:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'mon';
	}

	Visit.find({userId: req.session.user}, function(err, visits) {
		if (err) return next(err);

		var weekArray =[
			{gym: false, pool: false, running: false},
			{gym: false, pool: false, running: false},
			{gym: false, pool: false, running: false},
			{gym: false, pool: false, running: false},
			{gym: false, pool: false, running: false},
			{gym: false, pool: false, running: false},
			{gym: false, pool: false, running: false}
		];

		weekArray[today.getUTCDay()] = {
			gym: res.locals.visitedGym,
			pool: res.locals.visitedPool,
			running: res.locals.visitedRun
		};

		req.session.weekArray = res.locals.weekArray = weekArray;

		//log.info(visits);

		next();
	});
};