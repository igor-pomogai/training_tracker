var User = require('tt/models/user').User;
var Visit = require('tt/models/visit').Visit;

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
	// Array of month Names
	var monthNames = ["January","February","March","April","May",
		"June","July","August","September","October","November","December"];

	return monthNames[month];

}
