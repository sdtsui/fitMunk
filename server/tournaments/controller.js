var Q = require('q');
var Tournament = require('../tournaments/model.js');
var User = require('../users/model.js');

var find = Q.nbind(Tournament.find, Tournament);
var findOne = Q.nbind(Tournament.findOne, Tournament);
var create = Q.nbind(Tournament.create, Tournament);
var findOneTournament  = Q.nbind(Tournament.findById, Tournament);
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
  console.log('create: ',create.toString());
  console.log('inside create.');
  var newTournament = req.body;
  var userId = req.params.user_id;
  console.log('req.body : ', req.body);
  findOne({name: req.body.name})
    .then(function(tournament){
      if (tournament) {
        console.log('inside duplicate case : ', tournament, !!tournament);
        res.send(new Error('Tournament Already Exists'));
      } else {
        console.log('inside non-dup case');
        console.log('about to create newTourney :', newTournament);
        Tournament.create(newTournament, function(error, data){
          console.log('error : ', error);
          console.log('data : ', data);
        });
        // create(newTournament)
        //   .then(function(error, tournament) {
        //     console.log('error : ', error);
        //     console.log('tournament :', tournament);
        //     var id = tournament._id;
        //     if (error) {
        //       res.send(error);
        //     } else {
        //       User.findOne({_id: userId}, function(user){
        //         user.tournamentsActive.addToSet(id);
        //         res.sendStatus(204);
        //       })
        //       .catch(function(err){
        //         console.log('in nested error');
        //         res.send(err);
        //       }); 
        //     }
          // });
      }
    })
    .catch(function(err){
      console.log('in parent error');
      res.send(err);
    });
};

tournaments.inviteHandler = function(req, res, next){
  var tournament_id = req.params.tournament_id;
  var user_id = req.body.user_id;
  var action = req.body.action;

  findOneTournament({_id: tournament_id})
    .then(function(tournament){
      if (!tournament){
        res.send(new Error('Tournament does not exist.'));
      } else {
        User.findOne({_id: user_id})
          .then(function(user){
            if(!user){
              res.send(new Error('Tournament exists, but user does not.'))
            } else {
              //Has user, must be a string.
              if (action === 'decline') {
                console.log('invite: inside dec');
                tournament.participantsPending.pull(user_id);
                user.tournamentsInvited.pull(tournament_id);
              } else if (action === 'accept'){
                console.log('invite: inside acc');
                tournament.participantsPending.pull(user_id);
                tournament.participantsActive.addToSet(user_id);
                user.tournamentsInvited.pull(tournament_id);
                user.tournamentsActive.addToSet(tournament_id);
              } else if (action === 'invite'){
                console.log('invite: inside inv');
                tournament.participantsPending.addToSet(user_id);
                user.tournamentsInvited.addToSet(tournament_id);
              } else {
                return res.send(new Error('Invalid Action'));
              }
              res.sendStatus(204);
            }
          });
      }
    })
    .catch(function(err){
      if(err){
        res.send(err);
      }
    });
  //remove from pending
  //find the user, and remove from invited
}

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

tournaments.end = function(req, res, next){

}
module.exports = tournaments;

