var mongoose = require('mongoose');

var tournamentsListSchema = new Mongoose.Schema({
  tournament_id: String
});

module.exports = mongoose.model('tournamentsList', tournamentsListSchema);
