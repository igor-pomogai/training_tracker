angular.module('trackerApp.profileCtrl', [])

	.controller('profileCtrl', 
		['$scope', 'ProfileService', function($scope, ProfileService) {

			$scope.activities = [];
			
			$scope.saveActivities = function() {

			};

			$scope.removeActivity = function() {

			};

			
			ProfileService.getUserByName('dayaram', function(user) {
				
				$scope.user = user[0];

				ProfileService.getActivities(function(data) {

					var saved = false;

					for (var i = 0; i < data.length; i++) {

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

					console.log($scope.user.activities);
					console.log($scope.activities);

				});

				

			});

	}]);