;(function() {

angular.module('trackerApp.friendsListComponent', [])

	.directive('friendsList', ['$location', function($location) {
		return {
			restrict: 'E',
			scope: {
				friends: '=users'
			},
			templateUrl: 'app/shared/friendsListComponent/friendsListView.html',
			link: function(scope, elem, attrs) {
				
				scope.writeMessage = function(friend) {

				};

				scope.userInfo = function(friend) {
					$location.url('/profile/' + friend.userId);
				};

				scope.removeFriend = function(friend) {

				};
			}
		};
	}])

})();