angular.module('fm.tournament', [])

.controller('tournamentCtrl', function($scope, $stateParams, Tournament){
  angular.extend($scope, $stateParams, Tournament);


  // Stores tournament Data (start, end, etc)
  $scope.tournamentData;

  // This is currently hard-coded, needs to be changed when Jacky gets the api working
  $scope.users = [];


  // fetch data from database
  Tournament.getOneTournament($stateParams._id).
    success(function(data, status){
      $scope.tournamentData = data;
      console.log($scope.tournamentData);
    }).
    error(function(data, status){
      console.error('[Error] trying to fetch tournament data with status', status)
    });


})

.directive('fmTournament', function(){
  return {
    restrict    : 'EA',
    scope       : false,
    replace     : true,
    templateUrl : '../scripts/tournament/tournament.html',
    link        : function(scope, el, attr) {
      // stuff to go here...
    }
  }
})

// add nested directives here...