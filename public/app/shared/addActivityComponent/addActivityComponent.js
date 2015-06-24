;(function() {

angular.module('trackerApp.addActivityComponent', [])

	.directive('addActivity', ['AddActivityService', function(AddActivityService) {
		return {

			restrict: 'E',

			templateUrl: 'app/shared/addActivityComponent/addActivityView.html',

			//template: '<p>test</p>',

			scope: {
				activities: '='
			},

			link: function(scope, element, attrs) {

				console.log(scope.activities);

				scope.activity = {
					title: '',
					coeff: ''
				};

				scope.addActivity = function() {

					if (scope.activity.title == '') return;

					console.log('activity to save:');
					console.log(scope.activity);

					AddActivityService
						.saveActivity(scope.activity)
						.success(function(result) {
							
							console.log('acitivity saved: ');
							console.log(result);

							scope.activity = {
								title: '',
								coef: ''
							};

							scope.activities.push(result);

						})
						.error(function(result) {
							console.log('Error.');
							console.log(result);
						});
				};

			}

		};
	}]);

})();