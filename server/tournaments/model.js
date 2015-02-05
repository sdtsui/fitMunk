var mongoose = require('mongoose');
// var participantListSchema = require('../tournaments/participantListSchema.js');

var tournamentsSchema = new mongoose.Schema({
  tournament_id: mongoose.Schema.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: String,
  recurrence: String,
  theme: String,
  isPrivate: Boolean,
  isActive: Boolean,
  start: Date,
  end: Date,
  goal: Number,
  participants: {
    pending: [String],
    active: [String]
  },
  results: {
    gold: String,
    silver: String,
    bronze: String
  }
});

module.exports = mongoose.model('tournaments', tournamentsSchema);




