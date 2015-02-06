var mongoose = require('mongoose');
// var tournamentListSchema = require('../users/tournamentListModel.js');


var UsersSchema = new mongoose.Schema({
  user_id: {
    type      : String,
    required  : true,
    unique    : true
  },
  avatar: String,
  tokenSecret: String,
  token: String,
  full_name: {
    type: String,
    required: true
  },
  strideRunning: Number,
  strideWalking: Number,
  lifetimeSteps: Number,
  tournamentsClosed: [String],
  tournamentsInvited: [String],
  tournamentsActive: [String]
});

module.exports = mongoose.model('users', UsersSchema);