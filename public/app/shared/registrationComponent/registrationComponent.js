;(function() {

angular.module('trackerApp.registrationComponent', [])
	
	.directive('registrationComponent', ['RegistrationService', function(RegistrationService) {
		return {

			restrict: 'E',

			scope: { 
				usersList: '=userslist'
			},

			templateUrl: 'app/shared/registrationComponent/registrationView.html',

			link: function(scope, element, attrs) {
				var today = new Date();

				scope.firstname = '';
				scope.lastname = '';
				scope.email = 'example@tracker.com';
				scope.username = '';
				scope.birthday = today.getDate();
				scope.birthyear = today.getFullYear();
				scope.birthmonth = today.getMonth();

				scope.register = function() {

					//make a user object and send it
					validateValues();
					checkConfirmPassword();

					var user = {
						firstname: scope.firstname,
						lastname: scope.lastname,
						email: scope.email,
						username: scope.username,
						birthDate: scope.birthday,
						birthMonth: scope.birthmonth,
						birthYear: scope.birthyear,
						password: scope.password
					};

					RegistrationService.registerUser(user, function(registeredUser) {
						if (registeredUser) {
							console.log('User registered.');

							scope.usersList.push(registeredUser);

							initFields();

						} else {
							console.log('ERROR. User registration failed.');
						}
					});

				};

				var validateValues = function() {
					return true;
				};

				var checkConfirmPassword = function () {
					return true;
				};

				var initFields = function() {
					scope.firstname = '';
					scope.lastname = '';
					scope.email = 'example@tracker.com';
					scope.username = '';
					scope.birthday = today.getDate();
					scope.birthyear = today.getFullYear();
					scope.birthmonth = today.getMonth();
				}


			}
		};
	}]);

})();