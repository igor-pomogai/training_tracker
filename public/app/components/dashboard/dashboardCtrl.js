;(function() {

angular.module('trackerApp.dashboardCtrl', [])

	.controller('dashboardCtrl', 
		['$scope', 'DashboardService', function($scope, DashboardService) {

			var activitiesFromVisits;

			$scope.user = {};
			$scope.activities = [];
			$scope.todayDate = new Date();

			DashboardService.getUserByName('dayaram', function(data) {
				
				$scope.user = data;

				$scope.activities = formatActivities($scope.user.activities);

				activitiesFromVisits = getActivitiesFromVisits($scope.user.visits);

				$scope.activities.forEach(function(activity) {
					for (var i = 0; i < activitiesFromVisits.length; i++) {
						if (activitiesFromVisits[i].id == activity.id ) {
							activity.saved = activity.selected = true;
						}
					}
				});

			});

			function getActivitiesFromVisits(visits) {
				
				var today = new Date(),
					activities = [];

				today.setHours(0, 0, 0, 0);

				for (var i = 0; i < visits.length; i++) {

					var visitDate = new Date(visits[i].visitDate);

					if (visitDate.getTime() !== today.getTime()) continue;

					activities.push({
						id: visits[i].activityId
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
						id: activities[i].actId,
						selected: false,
						saved: false
					});

				}

				return formattedActivities;

			}	

			$scope.saveVisits = function(selectedArray) {

				DashboardService.saveVisits($scope.user._id, selectedArray, function(result) {
					if (result) { 
						console.log('Save visits success.');
					} else {
						console.log('ERROR. Save visits failed.');
					}
				});

			};

			$scope.removeVisit = function(activityId) {

				DashboardService.removeVisit($scope.user._id, activityId, function(result) {
					if (result) { 
						console.log('Remove visit success.');
					} else {
						console.log('ERROR. Remove visit failed.');
					}
				});

			};

			$scope.getUser = function(name) {

				DashboardService.getUserByName('dayaram', function(data) {
					console.log(data);
				});

			};

	}]);

})();