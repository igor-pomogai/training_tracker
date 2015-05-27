;(function() {

angular.module('trackerApp.addActivityService')

	.factory('AddActivityService', ['$http', function($http) {
		return {

			saveActivity: function(activity, callback) {
				$http.post('/activities', {
						activity: activity
					})
					.success(function(result) {

					});
			}

		};
	}]);

})();