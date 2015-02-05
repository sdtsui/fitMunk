var superagent    = require('superagent');
var chai          = require('chai');
var expect        = chai.expect;
var Tournament    = require('../server/tournaments/model.js');
var mongoose      = require('mongoose');

var dbPath      = process.env.dbPath || 'mongodb://localhost/fitMunk';
var db = mongoose.connect(dbPath);

mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});



var Q = require('q');

var find = Q.nbind(Tournament.find, Tournament);
var findOne = Q.nbind(Tournament.findOne, Tournament);

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
        console.log('tourney :', tourney);
        if(tourney){
          var t_id = tourney._id;
          console.log('tID :', t_id);
          superagent.get(paths.t+t_id)
            .send()
            .end(function(err, data){
              if(err){console.log('error :', err);}
              expect(data.res.body._id).to.equal(t_id.toString());
              done();
            });
        } else {
          done(new Error('no tourney'));
        }
      });
    })
  });
  xdescribe('Invite Handler : ',function(){});
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