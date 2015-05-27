;(function() {

angular.module('trackerApp.userListComponent', [])

	.directive('userListComponent', ['UserListService', function(UserListService) {
		return {

			restrict: 'E',

			scope: {
				usersList: '=userslist'
			},

			templateUrl: 'app/shared/userListComponent/userListView.html',

			link: function(scope, element, attrs) {
				
				scope.users = scope.usersList;

				/*
				UserListService.getAllUsers(function(users) {
					scope.users = users;
				});
				*/
			}
		};	
	}]);

})();