angular.module('fm.dashboard', [])

.controller('DashboardCtrl',function($http, $scope, User, Tournament){
	angular.extend($scope,User);

	if(!$scope.user.name){
		User.getInfo().then(function(d){
			console.log(d);
			$scope.user.name = d.name;
			$scope.user.avatar = d.avatar;
			$scope.user.strideRunning = Math.round(d.strideRunning);
			$scope.user.strideWalking = Math.round(d.strideWalking);
			$scope.user.lifetimeSteps = d.stats.lifetime.total.steps;
			$scope.user.tournamentsActive = Tournament.tournaments;
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
