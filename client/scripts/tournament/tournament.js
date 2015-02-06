angular.module('fm.tournament', [])

.controller('tournamentCtrl', function($scope, $stateParams, Tournament, User){
  angular.extend($scope, $stateParams, Tournament, User);

  // Stores tournament Data (start, end, etc)
  $scope.tournamentData;

  // This is currently hard-coded, needs to be changed when Jacky gets the api working
  $scope.users = [];

  $scope._exist = {};
  $scope._available = [];


  // send invite
  $scope.invite = function(){
    var user_id = $scope.invitee;
    Tournament.sendInvite($scope.invitee,$stateParams.tournament_id);
    $scope.invitee = '';
    $scope._available.forEach(function(user,i){
      console.log(user.user_id, user_id)
      if(user.user_id === user_id){
        $scope._available.splice(i,1);
        return;
      }
    })
  }

  // fetch data from database
  Tournament.getOneTournament($stateParams.tournament_id).
    success(function(data, status){
      $scope.tournamentData = data;
      //objectify existing users
      data.participantsActive.forEach(function(active){
        $scope._exist[active] = active;
      });
      //objectify existing users
      data.participantsPending.forEach(function(pending){
        $scope._exist[pending] = pending;
      });
    }).
    error(function(data, status){
      console.error('[Error] trying to fetch tournament data with status', status)
    });

  //fetch all usernames, excluding exisiting users
  User.getAll()
    .then(function(users){
      users.forEach(function(user){
        if(!$scope._exist[user.user_id]){
          $scope._available.push(user);
        }
      })
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