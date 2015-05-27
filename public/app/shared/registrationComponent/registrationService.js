;(function() {

angular.module('trackerApp.registrationService', [])

	.factory('RegistrationService', function($http) {
		return {

			registerUser: function(user, callback) {
				
				$http.post('/users', {
						user: user
					})
					.success(function(data) {
						callback(data);
					});
			}

		};
	});

})();