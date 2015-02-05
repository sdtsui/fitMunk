var express = require('express');
var router = express.Router();
var request = require('request');
var Users = require('./users/controller.js');
var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var fitbitControl = require('./utils/fitbit.js');


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
router.get('/api/tournaments/public', tournaments.read);
router.get('/api/tournaments/:tournament_id', tournaments.read);
router.post('/api/tournaments', tournaments.create);
router.put('/api/tournaments/:tournament_id', tournaments.update);
router.delete('/api/tournaments/:tournament_id', tournaments.delete);

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
