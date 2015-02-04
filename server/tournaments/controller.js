var db = require('../db.js');
// var Q = require('q');

var tournaments = {};

tournaments.read = function(req, res, next){
  // returns reference to tournaments in firebase
  return db.child('tournaments').once('value', function(){
    if (!data) {
      console.err('[Error] No Tournaments Found');
    } else {
      res.send(data);
    }
  });
};

tournaments.create = function(req, res, next){
  // returns reference to tournaments in firebase
  return db.child('tournaments');
};

tournaments.update = function(req, res, next){
  // returns reference to a specific tournament in firebase
  return db.child('tournaments').child(tournament_id);
};

tournaments.delete = function(req, res, next){
  // returns reference to specific tournament in firebase
  return db.child('tournaments').child(tournament_id);
};


module.exports = tournaments;

