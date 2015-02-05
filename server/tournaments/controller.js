var Q = require('q');
var Tournament = require('../tournaments/model.js');
var User = require('../users/model.js');

//Promisified Mongoose Functions.
var find = Q.nbind(Tournament.find, Tournament);
var findOne = Q.nbind(Tournament.findOne, Tournament);
var create = Q.nbind(Tournament.create, Tournament);

//old Namespaced
var findOneTournament  = Q.nbind(Tournament.findById, Tournament);
var findOneAndUpdate = Q.nbind(Tournament.findOneAndUpdate, Tournament);
var findOneAndRemove = Q.nbind(Tournament.findOneAndRemove, Tournament);


var ObjectId = (require('mongoose').Types.ObjectId);

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};


// NOTE: Database already has a user with the following test properties.
// Remove after Pathelete createUser is hooked up mongoose db.
// > db.users.find({})
// { "_id" : ObjectId("54d34575d6ea4d32d3f1adf9"), "user_id" : "test", "full_name" : "testFullName" }

var tournaments = {};


tournaments.read = function(req, res, next) {
  var id = req.params.tournament_id;
  // console.log(req.params);
  if ( id ) {
    console.log('inside ID');
    findOneTournament(id)
      .then(function(tournament){
        console.log('inside then : tournament: ', tournament);
        res.send(tournament);
      })
      .catch(function(error){
        res.send(error);
      });

  } else {
    find({})
      .then(function(tournaments){
        res.send(tournaments);
      })
      .catch(function(error){
        res.send(error);
      });
  }
};

tournaments.create = function(req, res, next){
  // console.log('create: ',create.toString());
  // console.log('inside create.');
  var newTournament = req.body;
  var userId = req.params.user_id;
  findOne({name: req.body.name})
    .then(function(tournament){
      if (tournament) {
        // console.log('inside duplicate case');
        res.sendStatus(500);
      } else {
        // console.log('inside non-dup case');
        // console.log('about to create newTourney :', newTournament);
        // Tournament.create(newTournament, function(error, data){
        //   console.log('error : ', error);
        //   console.log('data : ', data);
        //   res.sendStatus(200);
        // });
        create(newTournament)
          .then(function(tournament) {
            if (tournament) {
              var id = tournament._id;
              User.findOne({user_id: 'test'}, function(err, user){
                if(user){
                  user.tournamentsActive.addToSet(id);
                  tournament.participantsActive.addToSet(user._id);
                  user.save();
                  tournament.save();
                  res.sendStatus(200);
                  // console.log('saved user :', user);
                  // console.log('saved tourn :', tournament);
                }
              });
            } else {
              console.log('no tournament');
              res.sendStatus(500);
            }
          });
      }
    })
    .catch(function(err){
      console.log(err);
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

tournaments.testDel = function(req, res, next){
  findOne({name : 'book'})
    .then(function(tourney){
      if(tourney){
        tourney.remove();
        res.sendStatus(200);
      } else{
      }
    })
};

tournaments.delete = function(req, res, next){
  console.log('in delete: req.params : ', req.params);
  console.log('type of req.params.t_id : ', typeof req.params.tournament_id.toObjectId);
  var query = {_id: ObjectId(req.params.tournament_id)};
  console.log(query);
  findOne({name : 'book'})
    .then(function(tourney){
      if(tourney){
        console.log('found a tourney :', tourney);
        tourney.remove();
        res.sendStatus(200);
      } else{
        console.log('tourney not found : ', tourney);
      }

    })
};


tournaments.end = function(req, res, next){

}
module.exports = tournaments;

