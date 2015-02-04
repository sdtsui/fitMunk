var mongoose = require('mongoose');
var tournamentListSchema = require('../users/tournamentListModel.js');


var UserSchema = new mongoose.Schema({
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
    closed: [tournamentListSchema],
    invited: [tournamentListSchema],
    inProgress: [tournamentListSchema]
  }
});

module.exports = UserSchema;