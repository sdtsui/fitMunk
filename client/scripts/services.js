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

.factory('Tournament',function(){
  //test data
  var tourny = {
    _id: 'asd4758asdf586',
    name: '500K Challenge',
    description: 'Walk 500000 Weekly!',
    theme: 'hiking',
    status: 'OPEN',
    startDate: '2015-2-14',
    endDate: '2015-2-21',
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
  };

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
  };

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
  };

  var tournament = {};
  tournament.tournaments = [tourny,tourny1,tourny2];

  return tournament;
})
