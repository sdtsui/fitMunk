angular.module('fm.services', [])

.factory('Info', function ($http) {



})

.factory('User',function($http){
  var user = {};
  user.user = {};
  // gets user's fitbit info in the form of an object  
  user.getInfo = function(){
    return $http({
      method: 'GET',
      url: '/userdata'
    })
    .then(function (resp) {
      return resp.data;
    })
  };

  return user;
})


.factory('Tournament',function($http){

  var tournament = {};

  // returns a promise that will fetch the tournament data
  tournament.getOneTournament = function(tournament_id){
    return $http.get('/api/tournaments/' + tournament_id);
  };

  tournament.create = function(tournyData){
    return $http({
      method: 'POST',
      url: '/api/tournaments',
      data: tournyData
    })
    .then(function (resp) {
      return resp.data;
    })
  };

  return tournament;
})
