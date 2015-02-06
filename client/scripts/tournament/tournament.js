angular.module('fm.tournament', [])

.controller('tournamentCtrl', function($scope, $stateParams){
  angular.extend($scope, $stateParams);
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