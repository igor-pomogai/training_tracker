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

	var visit4 = new Visit({
		userId: req.session.user,
		visitDate: new Date(today.getFullYear(), today.getMonth(), 22)
	});
	visit4.running.push({});
	visit4.gymVisits.push({});

	var callback = function(err) {
		if (err) console.log(err);

		log.info('Visit saved!');
	};

	visit.save(callback);
	visit1.save(callback);
	visit2.save(callback);
	visit3.save(callback);
	visit4.save(callback);
};

module.exports = function(req, res, next) {
	//createTestVisits(req);

	var today = new Date(),
		todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()),
		oneDay = 24*60*60*1000,
		weekDay = todayDate.getDay() === 0 ? 7 : todayDate.getDay(),
		daysFromWeekStart = oneDay * weekDay,
		fromDay = todayDate - daysFromWeekStart;


	log.info('Week day: ' + weekDay);

	switch (weekDay) {
		case 7:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'sun';
			break;
		case 1:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'mon';
			break;
		case 2:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'tue';
			break;
		case 3:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'wed';
			break;
		case 4:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'thu';
			break;
		case 5:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'fri';
			break;
		case 6:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'sat';
			break;
		default:
			req.session.dayOfWeek = res.locals.dayOfWeek = 'mon';
	}



	Visit
		.find({userId: req.session.user})
		.where('visitDate').gt(fromDay).lte(todayDate)
		.limit(todayDate.getDay() > 0 ? todayDate.getDay() : 7 )
		.sort('-visitDate')
		.exec(function(err, visits) {
			if (err) return next(err);

			log.info('loaded visits: ' + visits.length);
			console.log(visits);

			// fill weekArray with FALSE
			var weekArray =[
				{gym: false, pool: false, running: false},
				{gym: false, pool: false, running: false},
				{gym: false, pool: false, running: false},
				{gym: false, pool: false, running: false},
				{gym: false, pool: false, running: false},
				{gym: false, pool: false, running: false},
				{gym: false, pool: false, running: false}
			];

			visits.forEach(function(visit) {
				var russianDayOfWeek = visit.visitDate.getDay() > 0 ? visit.visitDate.getDay() : 7;
				weekArray[russianDayOfWeek - 1] = {
					gym: visit.gymVisits.length > 0,
					pool: visit.poolVisits.length > 0,
					running: visit.running.length > 0
				};
			});
			
			req.session.weekArray = res.locals.weekArray = weekArray;

			next();
		});

/*
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

		weekArray[today.getDay()] = {
			gym: res.locals.visitedGym,
			pool: res.locals.visitedPool,
			running: res.locals.visitedRun
		};

		req.session.weekArray = res.locals.weekArray = weekArray;

		next();
	});
*/
};