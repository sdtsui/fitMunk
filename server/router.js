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
  // console.log(res.session);
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
