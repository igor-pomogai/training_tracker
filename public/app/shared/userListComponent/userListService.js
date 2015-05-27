;(function() {

angular.module('trackerApp.userListService', [])

	.factory('UserListService', ['$http', function($http) {
		return {

			getAllUsers: function(callback) {

				$http.get('/users')
					.success(function(users) {
						callback(users);
					});
			}

		};
	}]);

})();