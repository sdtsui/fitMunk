// var request = require('request');
var Q       = require('q');
var User    = require('../users/model.js');
var Tournaments = require('../tournaments/model.js');

//Mongoose methods, promisified
var findOneUser         = Q.nbind(User.find, User);
var findOneAndUpdate    = Q.nbind(User.findOneAndUpdate, User);
var findOneAndRemove    = Q.nbind(User.findOneAndRemove, User);

var controller = {};

controller.getTournaments = function(req, res, next) {
  var user_id = req.params.user_id;

  findOneUser({user_id: user_id})
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

// controller.declineTournament = function(req, res, next){
//   var tourneyString = req.params.tourneyString;
//   var user_id = req.params.user_id;

//   findOneUser({user_id: user_id})
//     .then(function(user){
//       if (!user) {
//         res.send(new Error('user doesnt exist'));
//       } else {
//         user.tournamentsInvited.pull(tourneyString);
//         res.sendStatus(204);
//       }
//     });
// };

// controller.acceptTournament = function(req, res, next){
//   //remove from invited, add to active
//   var tourneyString = req.params.tourneyString;
//   var user_id = req.params.user_id;
//   //remove from invited, add to active
//   findOneUser({user_id: user_id})
//     .then(function(user){
//       if (!user) {
//         res.send(new Error('user doesnt exist'));
//       } else {
//         user.tournamentsInvited.pull(tourneyString);
//         user.tournamentsActive.addToSet(tourneyString);
//         res.sendStatus(204);
//       }
//     });
// };

// controller.endTournament = function(req, res, next){
//   var tourneyString = req.params.tourneyString;
//   var user_id = req.params.user_id;

//   findOneUser({user_id: user_id})
//     .then(function(user){
//       if (!user) {
//         res.send(new Error('user doesnt exist'));
//       } else {
//         user.tournamentsActive.pull(tourneyString);
//         user.tournamentsClosed.addToSet(tourneyString)
//         res.sendStatus(204);
//       }
//     });
// };


// Old Code
module.exports = {
  addUser: function (token, tokenSecret, profile, done){},
  
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