;(function() {

angular.module('trackerApp.activitiesListComponent', [])

	.directive('activitiesList', ['ActivitiesListService', function(ActivitiesListService) {
		return {
			restrict: 'E',
			scope: {
				activities: '='
			},
			templateUrl: 'app/shared/activitiesListComponent/activitiesListView.html',
			link: function(scope, element, attrs) {

				console.log(scope.activities);

				if (scope.activities === undefined) {
					
					scope.activities = [];

					console.log('Get inner activities');
					
					ActivitiesListService.getAllActivities(function(result) {
						
						scope.activities = result;

					});

				} else {
					
					console.log('Get outer actitivites'); 
					
				}

				scope.removeActivity = function(id) {
					ActivitiesListService.removeActivity(id, function(result) {

						if (!result) return;
						
						scope.activities.forEach(function(element, index) {
							if (element._id == id) {
								scope.activities.splice(index, 1);
							}
						});

					});
				};
				
			}
		};
	}]);

})();