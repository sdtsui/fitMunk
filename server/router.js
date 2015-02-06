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
router.post('/api/tournaments', Tournaments.create);

//  InviteHandler:
router.put('/api/tournaments/:tournament_id/decline', Tournaments.inviteHandler);
router.put('/api/tournaments/:tournament_id/accept', Tournaments.inviteHandler);
router.put('/api/tournaments/:tournament_id/invite', Tournaments.inviteHandler);

//  End, Update Details
router.put('/api/tournaments/:tournament_id/end', Tournaments.end);
router.put('/api/tournaments/:tournament_id/update', Tournaments.update);

//Delete a tournament
router.delete('/api/tournaments/testDel', Tournaments.testDel);
router.delete('/api/tournaments/:tournament_id', Tournaments.delete);

// User Tournament API
router.get('/api/users/:user_id/tournaments', Users.getTournaments); //body: action: public or private;

// User get all users 
router.get('/api/users', Users.getAllUsers); //body: action: public or private;


// Tournament FitBit Data
// router.get('/api/tournaments/:tournament_id/fitbit-stats', FitBitControl.getStepsBetweenDates);







// Legacy Pathlete Routes
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login', function (req, res, next){
  res.redirect('/auth/fitbit');
});

passport.use(fitbitControl.fitbitStrategy);
router.get('/auth/fitbit', passport.authenticate('fitbit', { failureRedirect: '/login' }), function (req,res) {
  // console.log('hiiiiiiiiiiiii',req.user);
});

router.get('/auth/fitbit/callback', passport.authenticate('fitbit', { failureRedirect: '/login' }), function (req,res) {
  res.redirect('/#/dashboard');
});

router.get('/userdata', function(req, res) {
  if(!req.user){
    return;
  }
  Users.getUserStats(req.user.user_id, function(data) {
    res.send(data);
  });
});

module.exports = router;
