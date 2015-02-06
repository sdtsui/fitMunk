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

  //get all users
  user.getAll = function(){
    return $http({
      method: 'GET',
      url: '/api/users'
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

  tournament.fetch = function(id){
    var id = id || 'public';
    return $http({
      method: 'GET',
      url: '/api/tournaments/' + id
    })
    .then(function (resp) {
      return resp.data;
    })
  };

  tournament.sendInvite = function(user_id,id){
    return $http({
      method: 'put',
      url: '/api/tournaments/' + id +'/invite',
      data: {
        user_id: user_id,
        action: 'invite'
      }
    })
    .then(function (resp) {
      return resp.data;
    })
  }

  return tournament;
})
