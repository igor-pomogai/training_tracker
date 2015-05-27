angular.module('trackerApp.adminCtrl', [])

	.controller('adminCtrl', ['$scope', 'AdminService', function($scope, AdminService) {

		$scope.text = 'admin page';
		$scope.users = [];
		$scope.activities = [];

		AdminService.getAllUsers(function(users) {
			
			for(var i = 0; i < users.length; i++) {
				$scope.users.push(users[i]);
			}

		});

		AdminService.getAllActivities(function(activities) {

			for(var i = 0; i < activities.length; i++) {
				$scope.activities.push(activities[i]);
			}			

		});

	}]);