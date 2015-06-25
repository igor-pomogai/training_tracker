;(function() {

angular.module('trackerApp.allUsersService', [])

	.factory('AllUsersService', ['$http', function($http) {
		return {

			getAllUsers: function() {
				return $http.get('/users');
			},

			addFriend: function(userId, friendId) {
				return $http.post('/users/' + userId + '/friends/' + friendId);
			},

			getUserByName: function(name) {
				return $http.get('/users/name/' + name);
			}

		};
	}]);

})();