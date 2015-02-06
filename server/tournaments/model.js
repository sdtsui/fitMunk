var mongoose = require('mongoose');

var tournamentsSchema = new mongoose.Schema({
  // _id: mongoose.Schema.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: String,
  theme: String,
  isActive: {
    type: Boolean,
    default: true
  },
  creator: String,
  start: Date,
  end: Date,
  goal: Number,
  participantsPending: [String],
  participantsActive: [String],
  results: [String]
});

module.exports = mongoose.model('tournaments', tournamentsSchema);
