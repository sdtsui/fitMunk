var db      = require('../utils/db.js');
var request = require('request');
var q       = require('Q');
var User    = require('../users/model.js');

//Mongoose methods, promisified
var findOneUser         = Q.nbind(User.find, User);
var findOneAndUpdate    = Q.nbind(User.findOneAndUpdate, User);
var findOneAndRemove    = Q.nbind(User.findOneAndRemove, User);

var user = {};

User.getTournaments = function(req, res, next) {
  var user_id = req.params.user_id;
  var tournament_ids;
  findOneUser({user_id: user_id})
    .then(function(user){
      if (!user) {
        res.send(new Error('user doesnt exist'));
      } else {
        var tournaments = {};
        tournaments.closed = user.tournamentsClosed;
        tournaments.invited = user.tournamentsInvited;
        tournaments.inProgress = user.tournamentsInProgress;
        res.send(tournaments);
      }
    });
};

User.createTournament = function(req, res, next){
  var tourneyString = req.params.tourneyString;
  var user_id = req.params.user_id;
  findOneAndUpdate(
    {user_id: user_id},
    {$push: {tournamentsInProgress: tourneyString}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    })
    .then(function(){
      res.sendStatus(204)
    })
    .catch(function(err){
      res.send(err);
    });
}

User.declineTournament = function(req, res, next){
  var tourneyString = req.params.tourneyString;
  var user_id = req.params.user_id;
  findOneAndUpdate(
    {user_id: user_id},
    {$pull: {tournamentsInvited: tourneyString}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    })
    .then(function(user){
      if (!user) {
        res.send(new Error('user doesnt exist'));
      } else {
        res.sendStatus(204);
      }
    });
};

User.acceptTournament = function(req, res, next){
  //remove from invited, add to active
  var tourneyString = req.params.tourneyString;
  var user_id = req.params.user_id;
  findOneAndUpdate(
    {user_id: user_id},
    {$pull: {tournamentsInvited: tourneyString}},
    {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    })
    .then(function(){
      findOneAndUpdate(
        {}
        );
        }
      }
    })
    .catch(function(err){
      res.send(err);
    });
}

//need an endtournament


module.exports = user;



module.exports = {
  addUser: function (token, tokenSecret, profile, done){
    var err = '';
    //Add the user's profile info to the db
    db.child('users').child(profile.id).once('value', function (data) {
      if (data.val() === null) {
        var user = {};
        user.id = profile.id;
        user.tokenSecret = tokenSecret;
        user.token = token;
        user.name = profile._json.user.fullName;
        user.strideRunning = profile._json.user.strideLengthRunning;
        user.strideWalking = profile._json.user.strideLengthWalking;
        user.units = profile._json.user.distanceUnit;
        //if user is not already in the db
        db.child('users').child(profile.id).set(user);
      } else {
        //if user is already in db, update their profile info
        db.child('users').child(profile.id).update({tokenSecret: tokenSecret, token: token});
      }
    });
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