var express = require('express');
var router = express.Router();
var request = require('request');
var Users = require('./users/controller.js');
var passport = require('passport');
var FitbitApiClient = require('fitbit-node');
var fitbitControl = require('./utils/fitbit.js');


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
router.get('/api/tournaments/public', tournaments.read);
router.get('/api/tournaments/:tournament_id', tournaments.read);
router.post('/api/tournaments/:user_id', tournaments.create);
//PUT:
//declineInvite
router.put('/api/tournaments/:tournament_id/decline', tournaments.decline);
// //acceptInvite
// router.put('/api/tournaments/:tournament_id/decline', tournaments.decline);
// //sendInvite
// router.put('/api/tournaments/:tournament_id/decline', tournaments.decline);
// //end
// router.put('/api/tournaments/:tournament_id/decline', tournaments.decline);

router.put('/api/tournaments/:user_id/:tournament_id', tournaments.invite); // needs to be revisited
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
