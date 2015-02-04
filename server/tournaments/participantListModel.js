var mongoose = require('mongoose');

var participantListSchema = new mongoose.Schema({
  user_id: String
});


module.exports = participantListSchema;