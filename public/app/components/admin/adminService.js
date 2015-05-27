;(function() {

angular.module('trackerApp.adminService', [])

	.factory('AdminService', ['$http', function($http) {
		return {

			getAllUsers: function(callback) {

				$http.get('/users')
					.success(function(users) {
						callback(users);
					});

			},

			getAllActivities: function(callback) {

				$http.get('/activities')
					.success(function(activities) {
						callback(activities);
					});
			}

		};
	}]);

})();