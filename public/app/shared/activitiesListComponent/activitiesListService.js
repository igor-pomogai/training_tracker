;(function() {

angular.module('trackerApp.activitiesListService', [])

	.factory('ActivitiesListService', ['$http', function($http) {
		return {
			

			getAllActivities: function(callback) {

				$http.get('/activities')
					.success(function(activities) {
						callback(activities);
					});

			},

			removeActivity: function(id, callback) {

				$http.delete('/activities/' + id)
					.success(function(result) {
						callback(result);
					});

			}

		};
	}]);

})();