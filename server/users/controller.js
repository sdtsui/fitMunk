// var request = require('request');
var Q       = require('q');
var User    = require('../users/model.js');
var Tournaments = require('../tournaments/model.js');

//Mongoose methods, promisified
var findOneUser         = Q.nbind(User.findOne, User);
var findOneAndUpdate    = Q.nbind(User.findOneAndUpdate, User);
var findOneAndRemove    = Q.nbind(User.findOneAndRemove, User);
var findById            = Q.nbind(User.findById, User);
var createUser          = Q.nbind(User.create, User);

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

controller.addUser = function (token, tokenSecret, profile, done){
  var err = '';
  findOneUser({user_id:profile.id})
    .then(function(user){
      if(!user){
        var newUser = {};
        newUser.avatar = profile._json.user.avatar;
        newUser.user_id = profile.id;
        newUser.tokenSecret = tokenSecret;
        newUser.token = token;
        newUser.full_name = profile._json.user.fullName;
        newUser.strideRunning = profile._json.user.strideLengthRunning;
        newUser.strideWalking = profile._json.user.strideLengthWalking;

        createUser(newUser)
          .then(function(d){
            console.log('created user');
            done(d);
          })
      } else {
        console.log('Update User');
          done(user);
      }
    })
};

controller.getUserStats = function (userID, callback) {
  //take user id and query database
  console.log(userID);
  findOneUser({user_id:userID})
    .then(function(user){
      if(!user){
        callback(new Error('no user'));
      } else {
        callback(user);
      }
    })
};

controller.addUserStats = function(userID, userStats) {
  var stat = JSON.parse(userStats);
  findOneUser({user_id:userID})
    .then(function(user){
      if(!user){
        console.log('no user');
      } else {
        user.lifetimeSteps = stat.lifetime.total.steps;
        user.save();
      }
    })
};

// Legacy path code
var exports = {
  addUser: function (token, tokenSecret, profile, done){
    var err = '';
    //Add the user's profile info to the db
    db.child('users').child(profile.id).once('value', function (data) {
      if (data.val() === null) {
        var user = {};
        user.avatar = profile._json.user.avatar;
        user.id = profile.id;
        user.tokenSecret = tokenSecret;
        user.token = token;
        user.name = profile._json.user.fullName;
        user.strideRunning = profile._json.user.strideLengthRunning;
        user.strideWalking = profile._json.user.strideLengthWalking;
        user.units = profile._json.user.distanceUnit;
        db.child('users').child(profile.id).set(user);
      } else {
        //if user is already in db, update their profile info
        db.child('users').child(profile.id).update({tokenSecret: tokenSecret, token: token});
      }
    });
  },
  
  getUserStats: function (userID, callback) {
    return db.child('users').child(userID);
  },
  
  addUserStats: function (userID, userStats) {
    db.child('users').child(userID).child('stats').update(JSON.parse(userStats));
  }
};

module.exports = controller;
