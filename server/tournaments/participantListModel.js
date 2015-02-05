var mongoose = require('mongoose');

var participantsListSchema = new mongoose.Schema({
  user_id: String
});

module.exports = mongoose.model('participantsList', participantsListSchema);
