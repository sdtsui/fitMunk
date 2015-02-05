var express = require('express');
var router = express.Router();
var request = require('request');

// Requiring middleware:
// var bodyParser     = require('body-parser');

var Users = require('./users/controller.js');
var Tournaments = require('./tournaments/controller.js');

var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var fitbitControl = require('./utils/fitbit.js');

var mongoose       = require('mongoose');
var dbPath         = process.env.dbPath || 'mongodb://localhost/fitMunk';
//connect to mongo
mongoose.connect(dbPath);

//Middleware:
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

passport.serializeUser(function(user, done) {
  // console.log('serializeUser', arguments);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(fitbitControl.fitbitStrategy);
  router.get('/auth/fitbit', passport.authenticate('fitbit', { failureRedirect: '/login' }), function (req,res) {
});

// Tourney API
//    Get one or all tournaments.
router.get('/api/tournaments/public', Tournaments.read);
router.get('/api/tournaments/:tournament_id', Tournaments.read);

//    Create One:
router.post('/api/tournaments/:user_id', Tournaments.create);

//  InviteHandler:
router.put('/api/tournaments/:tournament_id/declineInvite', Tournaments.inviteHandler);
router.put('/api/tournaments/:tournament_id/acceptInvite', Tournaments.inviteHandler);
router.put('/api/tournaments/:tournament_id/invite', Tournaments.inviteHandler);

//  End, Update Details
router.put('/api/tournaments/:tournament_id/end', Tournaments.end);
router.put('/api/tournaments/:tournament_id/update', Tournaments.update);

//Delete a tournament
router.delete('/api/tournaments/testDel', Tournaments.testDel);
router.delete('/api/tournaments/:tournament_id', Tournaments.delete);
// User Tournament API
router.get('/api/users/:user_id', Users.getTournaments); //body: action: public or private;


router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login', function (req, res, next){
  res.redirect('/auth/fitbit');
});
 
router.get('/auth/fitbit/callback', passport.authenticate('fitbit', { failureRedirect: '/login' }), function (req,res) {
  console.log(res.session);
  res.redirect('/progress');
});

router.get('/userdata', function(req, res) {
  Users.getUserStats(req.user.encodedId).once('value', function(data) {
      res.send(data.val());
    });
});

module.exports = router;
