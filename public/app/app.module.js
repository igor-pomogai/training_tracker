var trackerApp = angular.module('trackerApp', [
		'ngRoute', 
		'trackerApp.dashboardCtrl',
		'trackerApp.dashboardService',
		'trackerApp.profileCtrl',
		'trackerApp.profileService',
		'trackerApp.peopleCtrl',
		'trackerApp.adminCtrl',
		'trackerApp.adminService',
		'trackerApp.twoStateListCtrl',
		'trackerApp.registrationComponent',
		'trackerApp.registrationService',
		'trackerApp.userListComponent',
		'trackerApp.userListService',
		'trackerApp.activitiesListComponent',
		'trackerApp.activitiesListService',
		'trackerApp.addActivityService',
		'trackerApp.addActivityComponent',
		'trackerApp.visitsSummaryService',
		'trackerApp.visitsSummaryComponent',
		'trackerApp.friendsListComponent',
		'trackerApp.allUsersService',
		'trackerApp.allUsersComponent'
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
			.when('/profile/:userId', {
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

		//$locationProvider.html5Mode(true);

	});

trackerApp.controller('trackerCtrl', ['$scope', '$location', 
		function($scope, $location) {

			$scope.isAuthorized = true;
			
			$scope.navClass = function(page) {
				var currentRoute = $location.path().substring(1) || 'dashboard';

				if (currentRoute.indexOf('/') != -1) {
					currentRoute = currentRoute.slice(0, currentRoute.indexOf('/'))					
				}

				//console.log('route: ' + currentRoute);

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