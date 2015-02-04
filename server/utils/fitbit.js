var FitbitStrategy = require('passport-fitbit').Strategy;
var FitbitApiClient = require('fitbit-node');
var passport = require('passport');
var Users =require('../users/controller.js');

module.exports = exports = {
  fitbitStrategy: new FitbitStrategy({
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
      callbackURL: '/auth/fitbit/callback',
      userAuthorizationURL: 'https://www.fitbit.com/oauth/authorize'
    }, function (token, tokenSecret, profile, done) {   
      //after oath login call this success handler
          //add user to db
          Users.addUser(token, tokenSecret, profile);  
          //this line waits for 26 to finish
          exports.getStats(profile.id, token, tokenSecret).then(function() { 
            //done tells the program you are done and want to go to the next step
            done(null, profile._json.user); 
          });
        }),

  getStats: function (userID, token, secret) {
    var client = new FitbitApiClient(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET);
    //creates the request to get activites json from fitbit
    return client.requestResource('/activities.json', 'GET', token, secret).then(function (data) {  
        //success handler for req, return the promise
        Users.addUserStats(userID, data[0]); 
      }, function (err) {
        console.log('ERROR!',err);
      });
  }
};
