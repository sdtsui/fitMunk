// var request = require('request');
var Q       = require('q');
var User    = require('../users/model.js');
var Tournaments = require('../tournaments/model.js');

//Mongoose methods, promisified
var findOneUser         = Q.nbind(User.find, User);
var findOneAndUpdate    = Q.nbind(User.findOneAndUpdate, User);
var findOneAndRemove    = Q.nbind(User.findOneAndRemove, User);
var findById            = Q.nbind(User.findById, User);

var controller = {};

controller.getTournaments = function(req, res, next) {
  var user_id = req.params.user_id;
  findById(user_id)
    .then(function(user){
      if (!user) {
        res.send(new Error('user doesnt exist'));
      } else {
        var Tournaments = {};
        Tournaments.closed = user.tournamentsClosed;
        Tournaments.invited = user.tournamentsInvited;
        Tournaments.active = user.tournamentsActive;
        res.send(Tournaments);
      }
    });
};

// Legacy path code
module.exports = {
  addUser: function (token, tokenSecret, profile, done){
    //see old schema
  },
  
  getUserStats: function (userID, callback) {
    //take user id and query the firebase database
    return db.child('users').child(userID);
  },
  
  //add user activity, such as stairs and steps to their profile in the db
  addUserStats: function (userID, userStats) {
    db.child('users').child(userID).child('stats').update(JSON.parse(userStats));
  }

};

module.exports = controller;