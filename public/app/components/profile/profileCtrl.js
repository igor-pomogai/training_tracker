angular.module('trackerApp.profileCtrl', [])

	.controller('profileCtrl', 
		['$scope', '$routeParams', 'ProfileService', function($scope, $routeParams, ProfileService) {

			$scope.activities = [];
			$scope.userId = $routeParams.userId || null;

			$scope.isYou = true; //test approach [learn how to do it corect!]

			console.log('from profile controller. userId: ' + $scope.userId);
			
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

			if ($scope.userId !== null) {

				$scope.isYou = false;
				
				ProfileService.getUserById($scope.userId, function(user) {

					console.log('user returned from server: ' + user._id);

					$scope.user = user;

					getActivities();

				});

			} else {

				$scope.isYou = true;
				
				ProfileService.getUserByName('dayaram', function(user) {
				
					$scope.user = user;

					getActivities();

				});
			}

			var getActivities = function() {
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

						console.log('activities ready');

					});
			};
			
			

	}]);