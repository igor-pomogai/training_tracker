;(function() {

angular.module('trackerApp.visitsSummaryComponent', [])

	.directive('visitsSummary', ['VisitsSummaryService', function(VisitsSummaryService) {
		return {

			restrict: 'E',

			scope: {
				
				visits: '='

			},

			templateUrl: 'app/shared/visitsSummaryComponent/visitsSummaryView.html',

			link: function(scope, element, attrs) {
				
				var elem = {
					title: 'June, 2015',
					data: [
						{
							title: 'box',
							users: [
								{
									username: 'tamango',
									result: 4
								},
								{
									username: 'dayaram',
									result: 3
								},
								{
									username: 'fedyk',
									result: 4
								},
								{
									username: 'dima',
									result: 3
								}
							]
						},
						{
							title: 'football',
							users: [
								{
									username: 'tamango',
									result: 4
								},
								{
									username: 'dayaram',
									result: 3
								},
								{
									username: 'fedyk',
									result: 4
								},
								{
									username: 'dima',
									result: 3
								}
							]
						}
					]
				};


			



			}

		};
	}]);

})();