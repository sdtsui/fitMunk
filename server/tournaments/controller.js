var Q = require('q');
var Tournament = require('../tournaments/model.js');
var User = require('../users/model.js');

//Promisified Mongoose Functions.
var find = Q.nbind(Tournament.find, Tournament);
var findOne = Q.nbind(Tournament.findOne, Tournament);
var create = Q.nbind(Tournament.create, Tournament);

//old Namespaced
var findById  = Q.nbind(Tournament.findById, Tournament);
var findOneAndUpdate = Q.nbind(Tournament.findOneAndUpdate, Tournament);
var findOneAndRemove = Q.nbind(Tournament.findOneAndRemove, Tournament);

var u_findById = Q.nbind(User.findById, User);

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
  if ( id ) {
    findById(id)
      .then(function(tournament){
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

  findById(tournament_id)
    .then(function(tournament){
      if (!tournament){
        res.send(new Error('Tournament does not exist.'));
      } else {
        u_findById(user_id)
          .then(function(user){
            if(!user){
              res.send(new Error('Tournament exists, but user does not.'))
            } else {
              //Has user, must be a string.
              if (action === 'decline') {
                tournament.participantsPending.pull(user_id);
                user.tournamentsInvited.pull(tournament_id);

                tournament.save();
                user.save();
              } else if (action === 'accept'){
                tournament.participantsPending.pull(user_id);
                tournament.participantsActive.addToSet(user_id);
                user.tournamentsInvited.pull(tournament_id);
                user.tournamentsActive.addToSet(tournament_id);

                tournament.save();
                user.save();
              } else if (action === 'invite'){
                tournament.participantsPending.addToSet(user_id);
                user.tournamentsInvited.addToSet(tournament_id);

                tournament.save();
                user.save();
              } else {
                return res.send(new Error('Invalid Action'));
              }
              res.sendStatus(204);
            }
          });
      }
    })
    .catch(function(error){
      if(error){
        res.send(error);
      }
    })
    .done();
  //remove from pending
  //find the user, and remove from invited
}

tournaments.update = function(req, res, next){
  var updatedTournament = req.body;
  console.log('inside update, req.body :', req.body);
  var query = {_id: req.params.tournament_id};
  findOneAndUpdate(query, updatedTournament, function(error, data){
    console.log('in callback; data : ', data );
    if (error) {
      res.send(error);
    } else {
      res.send(data);
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
  //stores t_id
  //loops over both arrays
    //uses a helper function to:
    //  -find user with user_id
    //  -remove t_id from invited if pending
    //  -remove t_id from active if active
    //  -remove from Pending, or Active;


}

module.exports = tournaments;
