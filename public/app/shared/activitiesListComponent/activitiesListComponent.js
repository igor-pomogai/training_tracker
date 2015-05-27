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

				if (scope.activities === undefined) {
					
					scope.activities = [];

					console.log('Get inner activities');
					
					ActivitiesListService.getAllActivities(function(result) {
						
						scope.activities = result;

					});

				} else {
					
					console.log('Get outer actitivites'); 
					
				}
				
			}
		};
	}]);

})();