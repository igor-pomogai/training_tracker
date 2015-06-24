var Activity = require('tt/models/activity').Activity,
	User = require('tt/models/user').User,
	log = require('tt/libs/log')(module);

exports.getAll = function(req, res) {
	
	Activity
		.find()
		.exec(function(err, activities) {
			if (err) return res.json(false);
			
			res.json(activities);
		});

};

exports.insertActivity = function(req, res) {
	var activity = req.body.activity;

	Activity
		.findOne({title: activity.title})
		.exec(function(err, result) {
			if (err) return res.json(false);
			
			console.log(result);

			if (result) return res.json(false);

			var newActivity = new Activity({
				title: activity.title,
				coeff: activity.coef,
				approved: false
			});

			Activity.addActivity(newActivity, function(activity) {
				if (activity == null) return res.json(false);

				console.log(activity);

				res.json(activity);
			});

		});

};

exports.removeActivity = function(req, res) {
	var activityId = req.params.activityId;

	Activity
		.find({_id: activityId})
		.remove()
		.exec(function(err, result) {
			console.log(result);

			res.json(result);
		});
};

exports.approveActivity = function(req, res) {
	var activityId = req.params.activityId;

	Activity
		.findById(activityId)
		.exec(function(err, activity) {
			if (err) return res.json(false);

			if (!activity) return res.json(false);

			activity.approved = true;

			activity.save(function(err) {

				res.json(true);

			});
			
		});
};




/*
 * OLD API (remove in future commits)
 */

exports.getByUser = function(req, res, next) {
	var userId = req.params.userId,
		activitiesArray = [];

	User.find({_id: userId}, function(err, user) {
		if (err) return next(err);
		
		var userActivities;

		if (user.activities === undefined) {
			user.activities = [];
		} 
		
		Activity
			.find()
			.exec(function(err, activities) {
				if (err) return next(err);
				if (!activities) return;

				activities.forEach(function(activity) {
					
					activitiesArray.push({
						id: activity._id,
						title: activity.title,
						checked: ~user.activities.indexOf(activity._id)
					});

				});

				res.send(activitiesArray);

			});
	});
};

exports.removeByUser = function(req, res, next) {
	var userId = req.params.userId,
		activityId = req.params.activityId;

	User.findOne({_id: userId}, function(err, user) {
		if (err) return next(err);

		//user['activities'].splice(user['activities'].indexOf(activityId), 1);

		for (var i = 0; i < user.activities.length; i++) {
			if (user.activities[i].actId.equals(activityId)) {
				user.activities.splice(i, 1);
			}
		}

		user.save(function(err) {
			if (err) return next(err);

			res.send('success remove');
		});
	});
};

exports.saveByUser = function(req, res, next) {
	var userId = req.params.userId;

	User.findOne({_id: userId}, function(err, curUser) {
		if (err) return next(err);

		log.info('old user activities: ' + curUser.activities);

		if (curUser['activities'] === undefined) curUser.set('activities', []);
		
		if (req.body && req.body.formData) {

			var newActivities = [],
				i;

			var vars = req.body.formData.split("&");
			
			for (i = 0; i < vars.length ; i++) {
				var pair = vars[i].split("=");
				//newActivities.push(pair[1]);
				newActivities.push({
					title: pair[0],
					actId: pair[1]
				});

			}
			
			for (i = 0; i < newActivities.length ; i++) {
				curUser.activities.push(newActivities[i]);
			}

			curUser.save(function(err) {
				if (err) return next(err);

				log.info('activities for user: ' + curUser.username + ' saved.');
				log.info('new user activities: ' + curUser.activities);

				res.json(newActivities);
			});

		} else {
			curUser.activities = [];
			
		}
		
	});
};