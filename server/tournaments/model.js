var mongoose = require('mongoose');

var tournamentsSchema = new mongoose.Schema({
  // keep _id commented out; mongo takes care of its own IDs.
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  theme: String,
  isActive: Boolean,
  start: Date,
  end: Date,
  goal: Number,
  participantsPending: [String],
  participantsActive: [String],
  results: [String]
});

module.exports = mongoose.model('tournaments', tournamentsSchema);
