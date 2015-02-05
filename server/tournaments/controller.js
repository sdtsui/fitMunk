var db = require('../db.js');
var q = require('Q');
var Tournament = require('../tournaments/model.js');

var findAllTournaments = Q.nbind(Tournament.find, Tournament);
var findOneTournament  = Q.nbind(Tournament.findById, Tournament);
var createOneTournament = Q.nbind(Tournament.create, Tournament);



var tournaments = {};


tournaments.read = function(req, res, next) {
  var id = req.params.tournament_id;
  // console.log(req.params);
  if ( id ) {
    findOneTournament(id)
      .then(function(tournament){
        res.send(tournament);
      })
      .catch(function(error){
        res.send(error);
      });

  } else {
    findAllTournaments({})
      .then(function(tournaments){
        res.send(tournaments);
      })
      .catch(function(error){
        res.send(error);
      });
  }
};


tournaments.create = function(req, res, next){
  
};

tournaments.update = function(req, res, next){


};

tournaments.delete = function(req, res, next){

};


module.exports = tournaments;

