var mongoose = require('mongoose');

var tournamentListSchema = new Mongoose.Schema({
  tournament_id: String
});

module.exports = tournamentListSchema;
