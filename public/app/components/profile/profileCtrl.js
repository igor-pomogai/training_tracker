angular.module('trackerApp.profileCtrl', [])

	.controller('profileCtrl', 
		['$scope', '$routeParams', 'ProfileService', function($scope, $routeParams, ProfileService) {

			$scope.activities = [];
			$scope.userId = $routeParams.userId || null;
			
			$scope.saveActivities = function(selectedArray) {

				var userId = $scope.user._id;

				if (selectedArray.length == 0) return console.log('No activities selected');

				ProfileService.saveNewActivities(userId, selectedArray, function(result) {

					if (result) {
						console.log('New activities saved.');
					} else {
						console.log('Error saving activities.');
					}

				});

			};

			$scope.removeActivity = function(activityId) {

				var userId = $scope.user._id;

				ProfileService.removeActivity(userId, activityId, function(result) {
					if (result) {
						console.log('Activity removed.');
					} else {
						console.log('Error removing activity.');
					}
				});

			};

			
			ProfileService.getUserByName('dayaram', function(user) {
				
				$scope.user = user;

				ProfileService.getActivities(function(data) {

					var saved = false;

					console.log('all activities:');
					console.log(data);

					for (var i = 0; i < data.length; i++) {

						saved = false;

						for (var j = 0; j < $scope.user.activities.length; j++) {

							if ($scope.user.activities[j].actId == data[i]._id) {
								
								saved = true;
								
								break;
							}

						}

						$scope.activities.push({
							title: data[i].title,
							id: data[i]._id,
							selected: false,
							saved: saved
						});

					}

				});

			});

	}]);