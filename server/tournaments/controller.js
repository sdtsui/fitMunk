var db = require('../db.js');
var q = require('Q');
var Tournament = require('../tournaments/model.js');
var User = require('../users/model.js');

var findTournaments = Q.nbind(Tournament.find, Tournament);
var findOneTournament  = Q.nbind(Tournament.findById, Tournament);
var createOneTournament = Q.nbind(Tournament.create, Tournament);
var findOneAndUpdate = Q.nbind(Tournament.findOneAndUpdate, Tournament);
var findOneAndRemove = Q.nbind(Tournament.findOneAndRemove, Tournament);

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
    findTournaments({})
      .then(function(tournaments){
        res.send(tournaments);
      })
      .catch(function(error){
        res.send(error);
      });
  }
};

tournaments.create = function(req, res, next){
  var newTournament = req.body;
  var userId = req.params.user_id;
  findTournaments({name: req.body.name})
    .then(function(tournament){
      if (tournament) {
        res.send(new Error('Tournament Already Exists'));
      } else {
        createOneTournament(newTournament)
          .then(function(error, tournament) {
            var id = tournament._id;
            if (error) {
              res.send(error);
            } else {
              User.findOne({_id: userId}, function(user){
                user.tournamentsActive.addToSet(id);
                res.sendStatus(204);
              })
              .catch(function(err){
                res.send(err);
              }); 
            }
          });
      }
    });
};


tournaments.update = function(req, res, next){
  var updatedTournament = req.body;
  var query = {_id: req.params.tournament_id};
  findOneAndUpdate(query, updatedTournament, function(error, data){
    if (err) {
      res.send(err);
    } else {
      res.sendStatus(204);
    }
  });
};

tournaments.delete = function(req, res, next){
  var query = {_id: req.params.tournament_id};
  findOneAndRemove(query, function(err, data){
    if (err) {
      res.send(err);
    } else {
      res.sendStatus(204);
    }
  });
};

module.exports = tournaments;

