;(function() {

angular.module('trackerApp.friendsListComponent', [])

	.directive('friendsList', function() {
		return {
			restrict: 'E',
			scope: {
				friends: '=users'
			},
			templateUrl: 'app/shared/friendsListComponent/friendsListView.html',
			link: function(scope, elem, attrs) {

			}
		};
	})

})();