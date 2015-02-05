angular.module('fm.dashboard', [])

.controller('DashboardCtrl',function($scope){

})

.directive('fmDashboard',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
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
		controller   : 'DashboardCtrl',
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
		controller   : 'DashboardCtrl',
		templateUrl  : '../scripts/dashboard/overview.html',
		link				 : function(scope,el,attr){
		}
	}
})
