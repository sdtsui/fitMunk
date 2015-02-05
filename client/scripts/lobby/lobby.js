angular.module('fm.lobby', [])

.controller('LobbyCtrl',function($scope, Tournament){
	angular.extend($scope, Tournament);
})

.directive('fmLobby',function($animate){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/lobby/lobby.html',
		link				 : function(){
		}
	}
})

.directive('fmTournySearch',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		controller   : 'LobbyCtrl',
		templateUrl  : '../scripts/lobby/tournySearch.html',
		link				 : function(){
		}
	}
})