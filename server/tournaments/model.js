var mongoose = require('mongoose');
// var participantListSchema = require('../tournaments/participantListSchema.js');

var tournamentsSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true
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




