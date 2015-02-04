angular.module('fm.navbar', [])

.controller('NavbarCtrl',function($scope){

})

.directive('fmNavbar',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/navbar/navbar.html',
		link				 : function(){
		}
	}
})