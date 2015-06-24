;(function() {

angular.module('trackerApp.dashboardCtrl', [])

	.controller('dashboardCtrl', 
		['$scope', 'DashboardService', function($scope, DashboardService) {

			var activitiesFromVisits, 
				allActivities = [];

			$scope.user = {};
			$scope.activities = [];
			$scope.todayDate = new Date();
			$scope.visitsSummary = [];

			DashboardService.getUserByName('dayaram', function(data) {
				
				updateVisitsSummary();
				
				$scope.user = data;

				$scope.activities = formatActivities($scope.user.activities);

				activitiesFromVisits = getActivitiesFromVisits($scope.user.visits);

				$scope.activities.forEach(function(activity) {
					for (var i = 0; i < activitiesFromVisits.length; i++) {
						if (activitiesFromVisits[i].id == activity.id ) {
							activity.saved = activity.selected = true;
						}
					}
				});

			});

			function updateVisitsSummary() {

				DashboardService.getAllActivities(function(activities) {

					allActivities = activities;

					console.log('activities loaded: ' + activities.length);

					DashboardService.getFriends($scope.user._id, function(friends) {

						console.log('friends loaded: ' + friends.length);

						$scope.visitsSummary = [
							{
								title: 'June, 2015',
								data: {}
							}
						];

						//TODO IP:  change to ONLY SELECTED TO SHOW activities in future
						allActivities.forEach(function(activity) {
							
							$scope.visitsSummary[0].data[activity._id] = {
								show: true,
								title : activity.title,
								users : {}
							};

						});

						var today = new Date(),
									monthStart = new Date();

						monthStart.setDate(1);
						monthStart.setHours(0,0,0,0);

						today.setHours(23, 59, 59, 0);

						console.log('filtering visits between [' + monthStart + '] and [' + today + ']');
						
						friends.forEach(function(friend) {

							console.log('-processing user: ' + friend.username);
							console.log('--number of visits: ' + friend.visits.length);

							// TODO IP: think on how to minimize amount of iterations
							friend.visits.forEach(function(visit) {

								/*
								 * 1) check if visit date is between NOW and MONTH BEGINING
								 * 2) find <activityType> in visitsSummary.data array, 
								 * 		if NOT EXISTS - add
								 * 3) check if this user already exists in 
								 * 		visitsSummary.data.<activityType> array,
								 * 		if NO - add
								 * 4) increment 'result' property
							 	 */ 

							 	var visitDate = new Date(visit.visitDate);
							 	var isFromCurrentMonth = (+visitDate >= +monthStart && +visitDate <= +today);

							 	console.log('---current visit date: ' + visit.visitDate);
							 	console.log('---is it from current month: ' + isFromCurrentMonth);
							 	//console.log('----today timestamp: ' + +today);
							 	//console.log('----month begining timestamp: ' + +monthStart);
							 	//console.log('----visit timestamp: ' + +new Date(visit.visitDate) );
							 	 
								if (isFromCurrentMonth) {
									console.log(visit.activityId);
									console.log($scope.visitsSummary[0].data);

									console.log('activity is in list: ' + (visit.activityId in $scope.visitsSummary[0].data));

									if (visit.activityId in $scope.visitsSummary[0].data) {

										if (!(friend._id in $scope.visitsSummary[0].data[visit.activityId].users)) {

											$scope.visitsSummary[0].data[visit.activityId].users[friend._id] = {
												username: friend.username,
												result: 0
											};

										}

										$scope.visitsSummary[0].data[visit.activityId].users[friend._id].result++; 

									} else {
										
										$scope.visitsSummary[0].data[visit.activityId] = {
											show: true,
											title : activity.title,
											users : {}
										};

									}

								}

							});

						});

						console.log($scope.visitsSummary);

					});

				});
			}

			function getActivitiesFromVisits(visits) {
				
				var today = new Date(),
					activities = [];

				today.setHours(0, 0, 0, 0);

				for (var i = 0; i < visits.length; i++) {

					var visitDate = new Date(visits[i].visitDate);

					if (visitDate.getTime() !== today.getTime()) continue;

					activities.push({
						id: visits[i].activityId
					});

				}

				return activities;

			}

			function formatActivities(activities) {

				var formattedActivities = [];

				if (activities === undefined) return [];

				for (var i = 0; i < activities.length; i++) {
					
					formattedActivities.push({
						title: activities[i].title,
						id: activities[i].actId,
						selected: false,
						saved: false
					});

				}

				return formattedActivities;

			}	

			$scope.saveVisits = function(selectedArray) {

				DashboardService.saveVisits($scope.user._id, selectedArray, function(result) {
					if (result) { 
						console.log('Save visits success.');
					} else {
						console.log('ERROR. Save visits failed.');
					}
				});

			};

			$scope.removeVisit = function(activityId) {

				DashboardService.removeVisit($scope.user._id, activityId, function(result) {
					if (result) { 
						console.log('Remove visit success.');
					} else {
						console.log('ERROR. Remove visit failed.');
					}
				});

			};

			$scope.getUser = function(name) {

				DashboardService.getUserByName('dayaram', function(data) {
					console.log(data);
				});

			};

			$scope.generateVisits = function() {

				DashboardService.generateVisits(function(data) {
					
					console.log(data);
					
					updateVisitsSummary();
					
				});

			};

	}]);

})();