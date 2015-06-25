;(function() {

angular.module('trackerApp.allUsersComponent', [])

	.directive('allUsers', ['AllUsersService', '$location', function(AllUsersService, $location) {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: 'app/shared/allUsersComponent/allUsersView.html',
			link: function(scope, elem, attrs) {
				scope.users = [];
				scope.currentUser = {};

				var filterUsers = function(users) {
					for (var i = 0; i < scope.currentUser.friends.length; i++) {

						for (var j = users.length - 1; j >= 0; j--) {

							if (scope.currentUser._id == users[j]._id) {
								users.splice(j, 1);
							}
							
							if (scope.currentUser.friends[i].userId !== users[j]._id) continue;

							users[j].friend = true;	
						}
					}
				};

				AllUsersService.getUserByName('dayaram')
					.success(function(user) {
						scope.currentUser = user;

						AllUsersService.getAllUsers()
							.success(function(users) {
								console.log('get all users success');

								filterUsers(users);

								scope.users = users;
							})
							.error(function(err){
								console.log(err);
							});

					});

				scope.viewUser = function(id) {
					console.log('view user: ' + id);
					$location.url('/profile/' + id);
				};

				scope.addFriend = function(friend) {
					AllUsersService.addFriend(scope.currentUser._id, friend._id)
						.success(function(result) {
							if (result) {
								console.log('friend added');
								friend.friend = true;
							}
						});
				};

			}
		}
	}]);

})();