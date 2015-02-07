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
      //Draw graph drawing functions:
      /**
       * [Formats columns correctly for c3.generate]
       * @param  {[string]} name [user's name for c3 to graph with data]
       * @param  {[object]} als  ['activities-logs-steps' array from parsed json object]
       * @return {[type]}      [description]
       */
      scope.makeC3Col = function(name, als){
        var total = 0;
        var result = [name]
        var datedValues = [];
        for(var i = 0 ; i < als.length ; i++){
          var s = als[i].dateTime;
          var newDate = new Date(s.slice(0,4), s.slice(5,7), s.slice(8,10));
          datedValues.push([newDate, als[i].value]);
        }
        datedValues.sort(function(firstEl,secondEl){
          return firstEl[0] - secondEl[0];
        });
        for(var j = 0; j < datedValues.length ; j++){
          result.push(total += datedValues[j][1]);
        }
        return result;
      }

      //Mock Data, for un-authenticated graph drawing.
      scope.mockAjax1  =
      {
        "activities-log-steps":[
            {"dateTime":"2011-09-27","value":5490},
            {"dateTime":"2011-04-28","value":2344},
            {"dateTime":"2011-04-29","value":2779},
            {"dateTime":"2011-04-30","value":9196},
            {"dateTime":"2011-05-01","value":15828},
            {"dateTime":"2011-05-02","value":1945},
            {"dateTime":"2011-05-03","value":8366}
        ]
      };

      scope.mockName1 = 'Jacky';

      scope.mockAjax2  =
      {
        "activities-log-steps":[
            {"dateTime":"2011-09-27","value":3490},
            {"dateTime":"2011-04-28","value":9344},
            {"dateTime":"2011-04-29","value":1779},
            {"dateTime":"2011-04-30","value":8196},
            {"dateTime":"2011-05-01","value":11828},
            {"dateTime":"2011-05-02","value":1245},
            {"dateTime":"2011-05-03","value":10366}
        ]
      };

      scope.mockName2 = 'Devin';

      scope.mockAjax3  =
      {
        "activities-log-steps":[
            {"dateTime":"2011-09-27","value":1000},
            {"dateTime":"2011-04-28","value":1766},
            {"dateTime":"2011-04-29","value":6666},
            {"dateTime":"2011-04-30","value":12246},
            {"dateTime":"2011-05-01","value":16870},
            {"dateTime":"2011-05-02","value":10678},
            {"dateTime":"2011-05-03","value":8796}
        ]
      };

      scope.mockName3 = 'Dan';

      scope.mockAjax4  =
      {
        "activities-log-steps":[
            {"dateTime":"2011-09-27","value":500},
            {"dateTime":"2011-04-28","value":17},
            {"dateTime":"2011-04-29","value":16},
            {"dateTime":"2011-04-30","value":1246},
            {"dateTime":"2011-05-01","value":1870},
            {"dateTime":"2011-05-02","value":1799},
            {"dateTime":"2011-05-03","value":15}
        ]
      };

      scope.mockName4 = 'Wayne';

      var docWidth = $(document).find('#tournamentChart').width()*.8;

      scope.chart = c3.generate({
        bindto: '#tournamentChart',
        size: {width: docWidth},
        data: {
          columns: [
            scope.makeC3Col(scope.mockName1, scope.mockAjax1["activities-log-steps"]),
            scope.makeC3Col(scope.mockName2, scope.mockAjax2["activities-log-steps"])
          ],
        }
      });

      setTimeout(function () {
        scope.chart.load({
            columns: [
              scope.makeC3Col(scope.mockName3, scope.mockAjax3["activities-log-steps"])
            ]
        });
      }, 9500);

      setTimeout(function () {
        scope.chart.load({
            columns: [
              scope.makeC3Col(scope.mockName4, scope.mockAjax4["activities-log-steps"])
            ]
        });
      }, 4000);
    }
  }
});
