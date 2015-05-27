;(function() {

angular.module('trackerApp.twoStateListCtrl', [])
	
	.directive('twoStateList', function() {
		return {
			
			restrict: 'E',

			scope: {
				list: '=',
				listLabel: '=listlbl',
				sListLabel: '=slistlbl',
				savefn: '&',
				removefn: '&'
			},

			templateUrl: function(elem, attr) {
				return 'app/shared/twoStateList/twoStateList.html';
			},

			link: function(scope, element, attrs) {
				
				scope.filterSavedList = function(element) {
					return element.saved ? true : false;
				};

				scope.filterList = function(element) {
					return !element.saved ? true : false;
				};

				scope.save = function() {
					
					var selectedArray = scope.list.filter(function(el) {
						return el.selected ? el : false;
					});

					for (var i = 0; i < selectedArray.length; i++) {
						selectedArray[i].saved = true;
						selectedArray[i].selected = false;
					}
					
					console.log('selected array: ');
					console.log(selectedArray);
					
					scope.savefn({
						selectedArray: selectedArray
					});
				};

				scope.remove = function(activity) {

					activity.selected = false;
					activity.saved = false;
					
					scope.removefn({
						id: activity.id
					});

				};

			}
		};	
	});

})();