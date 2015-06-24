;(function() {

angular.module('trackerApp.dashboardService', [])
	
	.factory('DashboardService', function($http) {
		return {

			getUser: function(id) {

			},

			getUserByName: function(name, callback) {
				
				$http.get('/users/name/' + name)
					.success(function(data) {
						callback(data);
					});

			},

			getFriends: function(userId, callback) {

				$http.get('/users/' + userId + '/friends')
					.success(function(data) {
						callback(data);
					});

			},

			saveVisits: function(userId, activities, callback) {
				
				var activitiesIds = [];
				
				for (var i = 0; i < activities.length; i++) {
					activitiesIds.push(activities[i].id);
				}

				// TODO IP: remove userId and use user ID from the session or token
				$http.post('/users/' + userId + '/visits',
					{
						activities: activitiesIds
					})
					.success(function(data) {
						callback(data);
					});

			},

			removeVisit: function(userId, activityId, callback) {

				// TODO IP: remove userId and use user ID from the session or token
				console.log('calling endpoint for removing visit...');
				
				$http.delete('/users/' + userId + '/visits/' + activityId)
					.success(function(data) {
						callback(data);
					});

				console.log('endpoint for removing visit called.');

			},

			generateVisits: function(callback) {

				$http.post('/users/visits/generate')
					.success(function(data) {
						callback(data);
					});

			},

			getAllActivities: function(callback) {

				$http.get('/activities')
					.success(function(data) {
						callback(data);
					});

			}

		};
	});

})();