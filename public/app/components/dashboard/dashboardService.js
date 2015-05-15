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

			saveVisits: function(visits) {

			},

			cancelVisit: function(visitId) {

			},



		};
	});

})();