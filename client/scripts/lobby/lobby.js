angular.module('fm.lobby', [])

.controller('LobbyCtrl',function($scope){
	$scope.data = [];

	//test data
	var tourny = {
		_id: 'asd4758asdf586',
		name: '500K Challenge',
		description: 'Walk 500000 Weekly!',
		theme: 'hiking',
		status: 'OPEN',
		occurence: 7,
		isPrivate: false,
		startDate: '2015-2-14',
		endDate: null,
		goal: 500000,
		participants: {
			pending: [],
			accepted: ['asdf1231234','asd1234asf']
		},
		result: {
			gold: null,
			silver: null,
			bronze: null
		}
	}

	//test data
	var tourny1 = {
		_id: 'asd4758asdf586asd',
		name: '600K Challenge',
		description: 'Walk 600000 Weekly!',
		theme: 'marathon',
		status: 'OPEN',
		occurence: 7,
		isPrivate: false,
		startDate: '2015-2-14',
		endDate: null,
		goal: 600000,
		participants: {
			pending: [],
			accepted: ['asdf1231234','asd1234asf']
		},
		result: {
			gold: null,
			silver: null,
			bronze: null
		}
	}

		var tourny2 = {
		_id: 'asd4758asdf5asdfsd',
		name: '700K Challenge',
		description: 'Walk 700000 Weekly!',
		theme: 'beach',
		status: 'OPEN',
		occurence: 7,
		isPrivate: false,
		startDate: '2015-2-14',
		endDate: null,
		goal: 700000,
		participants: {
			pending: [],
			accepted: ['asdf1231234','asd1234asf']
		},
		result: {
			gold: null,
			silver: null,
			bronze: null
		}
	}

	$scope.data.push(tourny);
	$scope.data.push(tourny1);
	$scope.data.push(tourny2);
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