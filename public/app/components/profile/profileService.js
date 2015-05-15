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

			setUserActivities: function(usrId, activities, callback) {
				$http.post('/user/' + usrId + '/activities', 
					{
						activities: activities
					})
					.success(function(data) {
						callback(data);
					});
			}

		};

	});

})();