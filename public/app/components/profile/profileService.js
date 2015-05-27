;(function() {

angular.module('trackerApp.profileService', [])

	.factory('ProfileService', function($http) {

		return {
			
			getUserById: function(id, callback) {

			},

			getUserByName: function(name, callback) {
				$http.get('/users/name/' + name)
					.success(function(data) {
						callback(data);
					});
			},

			getActivities: function(callback) {
				$http.get('/activities')
					.success(function(data) {
						callback(data);
					});
			},

			saveNewActivities: function(usrId, activities, callback) {
				$http.post('/users/' + usrId + '/activities', 
					{
						activities: activities
					})
					.success(function(data) {
						callback(data);
					});
			},

			removeActivity: function(usrId, activityId, callback) {
				$http.delete('/users/' + usrId + '/activities/' + activityId)
					.success(function(data) {
						callback(data);
					});
			}

		};

	});

})();