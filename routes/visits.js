var User = require('models/user').User;
var Visit = require('models/visit').Visit;

exports.getVisits = function(req, res) {
	var GYM_COEFF = 1.0;
	var POOL_COEFF = 0.5;
	var RUN_COEFF = 0.5;

	var loadedVisits = {};
	var resultObject = {};

	User.find({}, function(err, users) {
		if (err) console.log(err);

		var curDate = new Date();
		var startOfMonth = new Date(curDate.getFullYear(), curDate.getMonth(), 1);

		users.forEach(function(user) {
			loadedVisits[user._id] = {
				'username': user.username,
				'gym': 0,
				'pool': 0,
				'run': 0,
				'points': 0
			};
		});

		Visit
			.find({})
			.where('userId')
			.in(Object.keys(loadedVisits))
			.where('visitDate').gte(startOfMonth).lte(curDate)
			.exec(function(err, visits) {
				if (err) console.log(err);

				visits.forEach(function(visit) {

					if(visit.gymVisits.length > 0) {
						loadedVisits[visit.userId].gym++;
					}
						
					if(visit.poolVisits.length > 0) {
						loadedVisits[visit.userId].pool++;
					}
				
					if(visit.running.length > 0) {
						loadedVisits[visit.userId].run++;
					}

				});

				for (var key in loadedVisits) {
					loadedVisits[key].points = 
						(loadedVisits[key].gym * GYM_COEFF)
						+ (loadedVisits[key].pool * POOL_COEFF) 
						+ (loadedVisits[key].run * RUN_COEFF);
				}

				resultObject = {
					visitsArray: loadedVisits,
					date: getDateString(curDate.getMonth()) + ', ' + curDate.getFullYear()
				};

				res.json(resultObject);
		});
	});

};

function getDateString(month) {
	var monthString = '';

	switch(month) {
		case 0:
			monthString = 'January';
			break;
		case 1:
			monthString = 'February';
			break;
		case 2:
			monthString = 'March';
			break;
		case 3:
			monthString = 'April';
			break;
		case 4:
			monthString = 'May';
			break;
		case 5:
			monthString = 'June';
			break;
		case 6:
			monthString = 'July';
			break;
		case 7:
			monthString = 'August';
			break;
		case 8:
			monthString = 'September';
			break;
		case 9:
			monthString = 'October';
			break;
		case 10:
			monthString = 'November';
			break;
		case 11:
			monthString = 'December';
			break;
	}

	return monthString;
}