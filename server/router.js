var express = require('express');
var router = express.Router();
var request = require('request');

//requiring middleware:
var ejs            = require('ejs');
var bodyParser     = require('body-parser');

var Users = require('./users/controller.js');
var Tournaments = require('./tournaments/controller.js');

var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var fitbitControl = require('./utils/fitbit.js');

//middleware:
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.engine('html',ejs.renderFile);
app.set('view engine', 'html');

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
router.get('/api/tournaments/public', Tournaments.read);
router.get('/api/tournaments/:tournament_id', Tournaments.read);
router.post('/api/tournaments/:user_id', Tournaments.create);
//PUT:
//declineInvite
router.put('/api/tournaments/:tournament_id/decline', Tournaments.inviteHandler);
// //acceptInvite
router.put('/api/tournaments/:tournament_id/accept', Tournaments.inviteHandler);
// //sendInvite
router.put('/api/tournaments/:tournament_id/invite', Tournaments.inviteHandler);
// //end
// router.put('/api/tournaments/:tournament_id/end', tournaments.end);
router.put('/api/tournaments/:tournament_id', Tournaments.update);
router.delete('/api/tournaments/:tournament_id', Tournaments.delete);

// User Tournament API
router.get('/api/tournaments/:username', user.readTournaments);
router.get('/api/tournaments/:username/:publicOrPrivate', user.readTournaments); // might be able to handle this same logic within readTournaments
router.post('/api/tournaments/:username/:tournament_id', user.enterTournament);
router.delete('/api/tournaments/:username/:tournament_id', user.leaveTournament);


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
  Users.getUserStats(req.user.encodedId).once('value', function(data) {
      res.send(data.val());
    });
});

module.exports = router;
