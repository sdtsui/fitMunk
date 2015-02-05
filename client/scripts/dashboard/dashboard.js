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
