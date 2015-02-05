var superagent    = require('superagent');
var chai          = require('chai');
var expect        = chai.expect;

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
  apiTournaments: 'http://localhost:1337/api/tournaments/'
}


describe('Testing CRUD functions at endpoints', function(){
  console.log('sup');
  describe('Create: ',function(){
    it('creates a new tournament', function(done){
      superagent.post(paths.apiTournaments+'/12345')
        .end(function(err, res){
          console.log(res.statusCode);
          done();
        });
    });
  });
  describe('Remove: ',function(){});
  describe('Update: ',function(){});
  describe('Delete',function(){});

})