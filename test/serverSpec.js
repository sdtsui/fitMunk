var superagent    = require('superagent');
var chai          = require('chai');
var expect        = chai.expect;
var Tournament   = require('../server/tournaments/model.js');
var mongoose = require('mongoose');
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});
console.log(mongoose.connection);

var Q = require('q');

var find = Q.nbind(Tournament.find, Tournament);
var findOne = Q.nbind(Tournament.findOne, Tournament);
console.log('find :', find);
console.log('findOne :', findOne);

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


describe('SPOT TESTS: Single API Endpoints', function(){
  console.log('sup');
  describe('Create One Tournament: ',function(){
    before(function(done){
      console.log('in before');
      Tournament.findOne({name: 'book'}, function(thing){
          console.log('thing :',thing);
        });
        // .then(function(thing){
        //   console.log('thing :',thing);
        // });
      console.log('finding One');
      findOne({name: 'book'})
        .then(function(tourney){
          console.log('in then: book?')
          if(tourney){
            console.log('book yes');
            var delPath = paths.t + tourney._id;
            console.log(delPath);
            superagent.del(delPath)
              .send()
              .end(function(err, res){
                console.log('res : ', res);
                if(err){
                  console.log(err);
                }else{
                  console.log('successful delete');
                }
              });
          } else {
            console.log('book no');
          }
          done();
        });
    });
    it('creates a new tournament', function(done){
      superagent.post(paths.t+'12345')
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
  xdescribe('Get One or All Tournaments : ',function(){});
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