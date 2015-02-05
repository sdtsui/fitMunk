var mongoose = require('mongoose');
// var tournamentListSchema = require('../users/tournamentListModel.js');


var UsersSchema = new mongoose.Schema({
  user_id: {
    type      : String,
    required  : true,
    unique    : true,
    lowercase : true
  },
  tokenSecret: String,
  token: String,
  full_name: {
    type: String,
    required: true
  },
  strideRunning: Number,
  strideWalking: Number,
  tournaments: {
    closed: [String],
    invited: [String],
    inProgress: [String]
  }
});

module.exports = mongoose.model('users', UsersSchema);