angular.module('fm.dashboard', [])

.controller('DashboardCtrl',function($http, $scope, User, Tournament){
	angular.extend($scope,User);
	$scope._active = [];
	$scope._invited = [];
	var fetched = false;
	if(!$scope.user.name && !fetched){
		User.getInfo().then(function(d){
			fetched = true;
			Tournament.user_id = d.user_id;
			$scope.user = d;
			$scope.user.tournamentsActive.forEach(function(id){
				Tournament.fetch(id)
					.then(function(d){
						$scope._active.push(d.name);
					})
			});
			$scope.user.tournamentsInvited.forEach(function(id){
				Tournament.fetch(id)
					.then(function(d){
						$scope._invited.push(d.name);
					})
			});
			$scope.user.strideRunning = Math.round(d.strideRunning);
			$scope.user.strideWalking = Math.round(d.strideWalking);
		})
	}
})

.directive('fmDashboard',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		controller   : 'DashboardCtrl',
		templateUrl  : '../scripts/dashboard/dashboard.html',
		link				 : function(scope,el,attr){
		}
	}
})

.directive('fmInvites',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/invites.html',
		link				 : function(scope,el,attr){
		}
	}
})

.directive('fmOverview',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/overview.html',
		link				 : function(scope,el,attr){
		}
	}
})

.directive('fmProgress',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/dashboard/progress.html',
		link				 : function(scope,el,attr){
		}
	}
})
