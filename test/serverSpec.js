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



var exampleUsers = {
  1: derpMonkey

};

var derpMonkey = {
  id: 12345,
  username: 'derpMonkey',
  password: 'herpWord',
} //

var exampleTourney = {
  t_id: 123,
  name: 'worlds',
  username: '!!',
  password: '??',
}

var paths = {
  t: 'http://localhost:1337/api/tournaments/'
}


// // Tourney API
// //    Get one or all tournaments.
// router.get('/api/tournaments/public', Tournaments.read);
// router.get('/api/tournaments/:tournament_id', Tournaments.read);

// //    Create One:
// router.post('/api/tournaments/:user_id', Tournaments.create);

// //  InviteHandler:
// router.put('/api/tournaments/:tournament_id/decline', Tournaments.inviteHandler);
// router.put('/api/tournaments/:tournament_id/accept', Tournaments.inviteHandler);
// router.put('/api/tournaments/:tournament_id/invite', Tournaments.inviteHandler);

// //  End, Update Details
// router.put('/api/tournaments/:tournament_id/end', tournaments.end);
// router.put('/api/tournaments/:tournament_id', Tournaments.update);

// //Delete a tournament
// router.delete('/api/tournaments/:tournament_id', Tournaments.delete);

// // User Tournament API
// router.get('/api/tournaments/:username', Users.getTournaments); //body: action: public or private;


var PRE_INSERTED_USER_ID = '54d34575d6ea4d32d3f1adf9';

describe('SPOT TESTS: Single API Endpoints', function(){

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
          // console.log('data.res.text', data.res.text);
          // console.log('data.res.body', data.res.body);
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
    it('can send an invite to a user',function(done){
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

    it('can decline an invite for a user',function(done){
      findOne({}).then(function(tourney){
        console.log('inside findone');
        if(tourney){
          var t_id = tourney._id;
          superagent.put(paths.t+t_id+'/declineInvite')
            .send({
              user_id: PRE_INSERTED_USER_ID,
              action: 'decline', 
            })
            .end(function(err, res){
              if(err){console.log('error :', err);}
              //Mongoose ObjectId needs to be converted to a string.
              expect(res.statusCode).to.equal(204);
              done();
            });
        } else {
          done(new Error('no tourney'));
        }
      });

    });
    xit('can accept an invite for a user',function(done){
      //accept not tested, don't have a second user/user creation ye
      findOne({}).then(function(tourney){
      if(tourney){
        var t_id = tourney._id;
        superagent.put(paths.t+t_id+'/acceptInvite')
          .send({
              user_id: PRE_INSERTED_USER_ID,
              action: 'accept', 
            })
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
    });

  });
  xdescribe('Delete a Tournament (prematurely)',function(){
    it('deletes a tournament', function(done){
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
  xdescribe('End, or Update Details for a tournament',function(){});
  xdescribe('User: Get tournaments (active or closed)',function(){});
})

xdescribe('Testing CRUD functions at endpoints', function(){
  describe('Create: ',function(){});
  describe('Remove: ',function(){});
  describe('Update: ',function(){});
  describe('Delete',function(){});
})