var trackerApp = angular.module('trackerApp', [
		'ngRoute', 
		'trackerApp.dashboardCtrl',
		'trackerApp.profileCtrl',
		'trackerApp.peopleCtrl',
		'trackerApp.adminCtrl'
	])

	.config(function($routeProvider, $locationProvider, $httpProvider) {

		$routeProvider
			.when('/dashboard',	{
				templateUrl: 'app/components/dashboard/dashboardView.html',
				controller: 'dashboardCtrl'
			}) 
			.when('/profile', {
				templateUrl: 'app/components/profile/profileView.html',
				controller: 'profileCtrl'	
			})
			.when('/people', {
				templateUrl: 'app/components/people/peopleView.html',
				controller: 'peopleCtrl'
			})
			.when('/admin', {
				templateUrl: 'app/components/admin/adminView.html',
				controller: 'adminCtrl'
			})
			.otherwise({
				redirectTo: '/dashboard',
				controller: 'dashboardCtrl'
			});

	});

trackerApp.controller('trackerCtrl', ['$scope', '$location', 
		function($scope, $location) {
			
			$scope.navClass = function(page) {
				var currentRoute = $location.path().substring(1) || 'dashboard';
				return page === currentRoute ? 'active' : '';
			};

			$scope.loadDashboard = function() {
				$location.url('/dashboard');
			};

			$scope.loadProfile = function() {
				$location.url('/profile');
			};

			$scope.loadPeople = function() {
				$location.url('/people');
			};

			$scope.loadAdmin = function() {
				$location.url('/admin');
			};

	}]);