var User = require('models/user').User;
var Visit = require('models/visit').Visit;

exports.get = function(req, res) {
	var loadedVisits = {};

	User.find({}, function(err, users) {
		if (err) console.log(err);

		users.forEach(function(user) {
			loadedVisits[user._id] = {
				'username': user.username,
				'gym': 0,
				'pool': 0,
				'run': 0
			};
		});

		Visit
			.find({})
			.where('userId')
			.in(Object.keys(loadedVisits))
			.exec(function(err, visits) {
				if (err) console.log(err);

				console.log(loadedVisits);

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

				}
			);

			res.json(loadedVisits);
		});
	});

};