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

				scope.selectedUser = undefined;


				/*
				UserListService.getAllUsers(function(users) {
					scope.users = users;
				});
				*/

				scope.selectUser = function(user) {
					scope.selectedUser = user;
					console.log(user._id);
				};
			}
		};	
	}]);

})();