var mongoose = require('mongoose');
var participantListSchema = require('../tournaments/participantListSchema.js');

var tournamentSchema = new mongoose.Schema({
  tournament_id: mongoose.Schema.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: String,
  recurrence: String,
  theme: String,
  isPrivate: Boolean,
  start: Date,
  end: Date,
  goal: Number,
  participants: {
    pending: [participantListSchema],
    active: [participantListSchema]
  },
  results: {
    gold: String,
    silver: String,
    bronze: String
  }
});

module.exports = tournamentSchema;




