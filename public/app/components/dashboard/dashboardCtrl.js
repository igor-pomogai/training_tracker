;(function() {

angular.module('trackerApp.dashboardCtrl', [])

	.controller('dashboardCtrl', 
		['$scope', 'DashboardService', function($scope, DashboardService) {

			var activitiesFromVisits;

			$scope.user = {};
			$scope.activities = [];
			$scope.todayDate = new Date();

			DashboardService.getUserByName('dayaram', function(data) {
				
				$scope.user = data[0];

				$scope.activities = formatActivities($scope.user.activities);

				console.log($scope.user);

				activitiesFromVisits = getActivitiesFromVisits($scope.user.visits);

				console.log($scope.activities);
				console.log(activitiesFromVisits);

			});

			function getActivitiesFromVisits(visits) {
				
				var today = new Date(),	
					//todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
					activities = [];

				today.setHours(0);

				for (var i = 0; i < visits.length; i++) {

					var visitDate = new Date(visits[i].visitDate);

					if (visitDate.getTime() !== today.getTime()) continue;

					activities.push({
						id: visits[i].actId
					});

				}

				return activities;

			}

			function formatActivities(activities) {

				var formattedActivities = [];

				if (activities === undefined) return [];

				for (var i = 0; i < activities.length; i++) {
					
					formattedActivities.push({
						title: activities[i].title,
						id: activities[i]._id,
						selected: false,
						saved: false
					});

				}

				return formattedActivities;

			}

		
		
/*
		$scope.visitedActivities = [
			
			{
				title: 'pool',
				id: 3,
				selected: false
			},
			{
				title: 'run',
				id: 4,
				selected: false
			},
			{
				title: 'gym',
				id: 5,
				selected: false
			}

		];


		$scope.activities = [
			{
				title: 'footbal',
				id: 1,
				selected: false
			},
			{
				title: 'box',
				id: 2,
				selected: false
			}
		];
*/

		$scope.saveVisits = function() {
			//make http post request
		};

		$scope.removeVisit = function(id) {
			//make http post request
		};

		$scope.getUser = function(name) {
			DashboardService.getUserByName('dayaram', function(data) {
				console.log(data);
			});
		};

	}]);

})();