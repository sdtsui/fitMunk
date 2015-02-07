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
var findOneUser = Q.nbind(User.findOne, User);

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

// [debug] - There might be an error in this read funciton, not getting tournament data back
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
  var newTournament = req.body;
  if(!req.body.creator){
    console.log('Not Logged In');
    res.sendStatus(500);
  } else {
    create(newTournament)
      .then(function(tournament) {
        if (tournament) {
          var id = tournament._id;
          User.findOne({user_id: req.body.creator}, function(err, user){
            if(user){
              user.tournamentsActive.addToSet(id);
              tournament.participantsActive.addToSet(user.user_id);
              user.save();
              tournament.save();
              res.sendStatus(200);
            }
          });
        } else {
          console.log('no tournament');
          res.sendStatus(500);
        }
      })
    .catch(function(err){
      console.log(err);
      res.send(err);
    });
  }
};

tournaments.inviteHandler = function(req, res, next){
  var tournament_id = req.params.tournament_id;
  var user_id = req.body.user_id;
  var action = req.url.split('/').pop();

  findById(tournament_id)
    .then(function(tournament){
      if (!tournament){
        res.send(new Error('Tournament does not exist.'));
      } else {
        findOneUser({user_id: user_id})
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
  var query = {_id: req.params.tournament_id};
  findOneAndUpdate(query, updatedTournament, function(error, data){
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
};

//For testing, using findOne instead of findById with tournament ids. 
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

tournaments.placeEntrant = function(category, user_id, t_id, tourney){
  u_findById(user_id)
    .then(function(user){
      if(category === 'pending'){
        //remove t_id from invited
        console.log('userBefore:  user, inv array :', user_id, user.tournamentsInvited);
        user.tournamentsInvited.pull(t_id);
        user.save();
        console.log('userAfter:  user, inv array :', user_id, user.tournamentsInvited);

        console.log('tBefore : t_id, t_pend', t_id, tourney.participantsPending);
        tourney.participantsPending.pull(user_id);
        tourney.save();
        console.log('tAfter : t_id, t_pend', t_id, tourney.participantsPending);
      } else if (cateogry === 'active'){
        //remove t_id from active
        console.log('userBefore:  user, active array :', user_id, user.tournamentsActive);
        user.tournamentsActive.pull(t_id);
        user.save();
        console.log('userAfter:  user, active array :', user_id, user.tournamentsActive);

        console.log('tBefore : t_id, t_act', t_id, tourney.participantsActive);
        tourney.participantsActive.pull(user_id);
        tourney.save();
        console.log('tAfter : t_id, t_act', t_id, tourney.participantsActive);
      } else {
        throw new Error('category error: expects strings "pending" or "active"');
      }
    })
};

tournaments.end = function(req, res, next){
  //signature: tournaments.placeEntrant = function(category, user_id, t_id, tourney){};
  var t_id = req.params.tournament_id;
  console.log('in end, t_id :', t_id);
  findById(t_id)
    .then(function(tourney){
      //two for loops, over the two arrays
      // in each loop:
      //  call function
      //  remove from self
      // for(var i = 0 ; i < )
      console.log('in Then : tourney', tourney);
      var pending = tourney.participantsPending;
      var active = tourney.participantsActive;
      console.log('in Then : t-pending, t-active :', pending, active);
      console.log('lengths:', pending.length, active.length);

      for (var i = 0; i < pending.length; i++){
        this.placeEntrant('pending', pending[i], t_id, tourney);
        console.log('P: loop :'+i);
      }
      for (var j = 0; j < active.length; j++){
        this.placeEntrant('active', active[j], t_id, tourney);
        console.log('A: loop :'+j);
      }
      res.send(tourney);
    })
    .catch(function(err){
      if(err){
        res.send(err);
      }
    });
  //stores t_id
  //loops over both arrays
    //uses a helper function to:
    //  -find user with user_id
    //  -remove t_id from invited if pending
    //  -remove t_id from active if active
    //  -remove from Pending, or Active;
}

module.exports = tournaments;
