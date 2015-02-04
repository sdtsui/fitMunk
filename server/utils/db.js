var Firebase = require('firebase');

//connect to Firebase instance
var db = new Firebase('https://fitmunk.firebaseio.com/');

module.exports = db;