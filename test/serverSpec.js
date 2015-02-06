var Q = require('q');
var superagent    = require('superagent');
var chai          = require('chai');
var expect        = chai.expect;
var Tournament    = require('../server/tournaments/model.js');
var User          = require('../server/users/model.js');
var mongoose      = require('mongoose');

var dbPath      = process.env.dbPath || 'mongodb://localhost/fitMunk';
var db = mongoose.connect(dbPath);

mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});

var findById  = Q.nbind(Tournament.findById, Tournament);
var find = Q.nbind(Tournament.find, Tournament);
var findOne = Q.nbind(Tournament.findOne, Tournament);
var u_findById = Q.nbind(User.findById, User);
var ObjectId = require('mongodb').ObjectId;

var paths = {
  t: 'http://localhost:1337/api/tournaments/',
  u: 'http://localhost:1337/api/users/'
}
var PRE_INSERTED_USER_ID = '54d34575d6ea4d32d3f1adf9';

describe('Tests: Single API Endpoints', function(){

  describe('Create One Tournament: ',function(){
    before(function(done){
      var delPath = paths.t + 'testDel';
      superagent.del(delPath)
        .send()
        .end(function(err, res){
          if(err){
            console.log(err);
          }else{
            console.log('successful delete');
          }
        });
      done();
    });

    it('creates a new tournament', function(done){
      superagent.post(paths.t+PRE_INSERTED_USER_ID)
        .send({
          name : 'book',
          description: 'bookdescription',
          theme: 'bookTheme',
          isActive: true,
          start: new Date("October 13, 2014 11:13:00"),
          end: new Date("October 15, 2014 11:13:00"),
          goal: 9001
        })
        .end(function(err, res){
          if(err){console.log(err);}
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('Get One or All Tournaments : ',function(){
    it('gets all Tournaments (public)', function(done){
      superagent.get(paths.t+'public')
        .send()
        .end(function(err, data){
          if(err){console.log('error :', err);}
          expect(data.res.body.length >0).to.equal(true);
          done();
        });
    });

    it('can get a specific tournament', function(done){
      findOne({}).then(function(tourney){
        if(tourney){
          var t_id = tourney._id;
          superagent.get(paths.t+t_id)
            .send()
            .end(function(err, data){
              if(err){console.log('error :', err);}
              //Mongoose ObjectId needs to be converted to a string.
              expect(data.res.body._id).to.equal(t_id.toString());
              done();
            });
        } else {
          done(new Error('no tourney'));
        }
      });
    })
  });
  describe('Invite Handler : ',function(){
    //Params: tournament_id
    //Body: user_id, action
    //Fully tested.
    it('can send invites',function(done){
      findOne({})
        .then(function(tourney){
        if(tourney){
          var t_id = tourney._id;
          return superagent.put(paths.t+t_id+'/invite')
            .send(
            {
              user_id: PRE_INSERTED_USER_ID,
              action: 'invite', 
            })
            .end(function(err, res){
              if(err){console.log('error :', err);}
              expect(res.statusCode).to.equal(204);

              Tournament.findById(t_id).exec(function(err, tourney){
                expect(tourney.participantsPending.indexOf(PRE_INSERTED_USER_ID)=== -1).to.equal(false);

                User.findById(PRE_INSERTED_USER_ID).exec(function(err, user){
                  expect(user.tournamentsInvited.indexOf(t_id.toString())=== -1).to.equal(false);
                  done();
                });
              });
            });
        } else {
          throw new Error('no tourney!');
          done(new Error('no tourney!'));
        }
      })
    });

    it('can decline invites',function(done){
      //not tested, but spot checked: 
      //saw length of both arrays decrement.
      findOne({}).then(function(tourney){
        if(tourney){
          var t_id = tourney._id;
          superagent.put(paths.t+t_id+'/declineInvite')
            .send({
              user_id: PRE_INSERTED_USER_ID,
              action: 'decline', 
            })
            .end(function(err, res){
              if(err){console.log('error :', err);}
              expect(res.statusCode).to.equal(204);
              done();
            });
        } else {
          done(new Error('no tourney'));
        }
      });
    });

    it('can accept an invites',function(done){
      //not tested, but spot checked: 
      //saw length of both arrays decrement.
      findOne({})
        .then(function(tourney){
          if(tourney){
            var t_id = tourney._id;
            superagent.put(paths.t+t_id+'/acceptInvite')
              .send({
                  user_id: PRE_INSERTED_USER_ID,
                  action: 'accept', 
                })
              .end(function(err, res){
                if(err){console.log('error :', err);}
                expect(res.statusCode).to.equal(204);
                done();
              });
          } else {
            done(new Error('no tourney'));
          }
          });
      });

  });

  describe('End, or Update a tournament',function(){
    //input: a tournament ID
    //remember the controller function has no type/propertyName validation
    it('Updates a tournament\'s details', function(done){
      var newProps = {
        name: 'It\'s Under 9000..',
        description: 'Walk under 9000 steps. MEH.',
        goal: 8999
      };
      
      findOne({})
        .then(function(tourney){
          if(tourney){
            var t_id = tourney._id;
            superagent.put(paths.t+t_id+'/update')
              .send(newProps)
              .end(function(err, res){
                if(err){console.log(err);}
                expect(res.statusCode).to.equal(200);
                expect(res.body.name).to.equal(newProps.name);
                expect(res.body.goal).to.equal(newProps.goal);
                done();
              });
          }
        });
    });

    it('Ends a tournament', function(done){
      findOne({})
        .then(function(tourney){
          var t_id = tourney._id;
          superagent.put(paths.t+t_id+'/end')
            .send()
            .end(function(err, res){
              if(err){console.log(err);}
              console.log('endTourney: res.body :', res.body);
              console.log('endTourney: res.body :', res);
              //res should be the whole tourney, check if errors exist;
              expect(res.body.participantsPending.length).to.equal(0);
              expect(res.body.participantsActive.length).to.equal(0);
              done();
            })
        });
      // superagent.put(paths.t+'/'+'/end');//needs to findOne first
      //pre-insert 4 total users
      //  1 creator, sends 3 invites:
      //  2 active: accept the invites
      //  1 pending: does nothing with invite
      //when tournament ends:
      //  tournament pending and active lists will be empty
      //  1 creator, 2 active, both lose a tournament from active list.
      //  1 pending loses a tournament from invite list.
      //    Feature: should be able to return a winner: 
      //    no api calls yet
    });
  });


  describe('User: Get tournaments (active or closed)',function(){
    //Note: this is a complete e2e test.
    //input: a user ID;
    //return an array of tournaments, either active or closed;
    it('Retrieves "active", "closed", and "invited" tournaments for a user', function(done){
      var userTournaments = {};
      var retrievedTournames = {};
      User.findById(PRE_INSERTED_USER_ID, function(err, user){
        if(user){
          userTournaments.closed  = user.tournamentsClosed;
          userTournaments.invited = user.tournamentsInvited;
          userTournaments.active  = user.tournamentsActive;
        }
      });
      superagent.get(paths.u+PRE_INSERTED_USER_ID)
        .send()
        .end(function(err, res){
          if(err){console.log(err);}
          //res.body should be a object, holding lists of tournaments;
          expect(userTournaments.closed.length).to.equal(res.body.closed.length);
          expect(userTournaments.closed[0]).to.equal(res.body.closed[0]);

          expect(userTournaments.active.length).to.equal(res.body.active.length);
          expect(userTournaments.active[0]).to.equal(res.body.active[0]);

          expect(userTournaments.invited.length).to.equal(res.body.invited.length);
          expect(userTournaments.invited[0]).to.equal(res.body.invited[0]);
          done();
        });
    });
  });

  xdescribe('Delete a Tournament',function(){
    it('deletes a tournament (before ending)', function(done){
      //must find one tournament, save the ID, send the string
      //RECOMMEND USING NAME INSTEAD: 
      //Or deprecate: Functionality is only for testing.
      var delPath = paths.t+'54d3251ea92f20200b0d6d6e';
      console.log(delPath);
      superagent.del(delPath)
        .send()
        .end(function(err, res){
          if(err){
            console.log(err);
          }else{
            expect(res.statusCode).to.equal(200);
            done();
          }
        })
    })
  });
})

xdescribe('Testing CRUD functions at endpoints', function(){
  describe('Create: ',function(){});
  describe('Remove: ',function(){});
  describe('Update: ',function(){});
  describe('Delete',function(){});
})