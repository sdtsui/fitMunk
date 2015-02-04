angular.module('fm.lobby', [])

.controller('LobbyCtrl',function($scope){
	$scope.data = [];

	//test data
	var tourny = {
		_id: 'asd4758asdf586',
		name: '500K Challenge',
		description: 'Walk 500000 Weekly!',
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

	// for(var i = 0; i < 10; i++){
	// 	var steps = Math.floor(Math.random()*1000000);
	// 	tourny._id = 'asasdf'+steps;
	// 	tourny.description = 'Walk '+steps+' Weekly';
	// 	tourny.name = steps+' Challenge';
	// 	tourny.goal = steps;
		$scope.data.push(tourny);
	// }
})

.directive('fmLobby',function(){
	return {
		restrict  	 : 'EA',
		scope				 : false,
		replace   	 : true,
		templateUrl  : '../scripts/lobby/lobby.html',
		link				 : function(){
		}
	}
})