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

  //declar params that will be bound to form in lobby.html
  tournament.name;
  tournament.desc;
  tournament.goal;
  tournament.startD;
  tournament.endD;

  tournament.submitTournament = function(){
    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    var data = { 
        name: this.name,
        desc: this.desc,
        goal: this.goal,
        theme:this.theme,
        startD:this.startD,
        endD: this.endD
      };

    var req = {
      method: 'POST',
      url: 'localhost:1337/api/tournaments/54d34575d6ea4d32d3f1adf9',
      data: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    }

    return $http(req)
              .then(function(data){
                if(!data){console.log('error')}
                console.log(data);
              });
  };
  return tournament;
})
