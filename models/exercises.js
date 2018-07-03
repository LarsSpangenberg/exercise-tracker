const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Exercises = new Schema({
  description: {
    type: String, 
    required: true,
    maxlength: [30, 'description is too long']
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Need a duration']
  },
  date: {
    type: Date,
    default: Date.now
  },
  username: String,
  userId: {
    type: String,
    ref: 'Users',
    index: true
  }
});

Exercises.pre('save', function(next) {
  mongoose.model('Users').findById(this.userId, function(err, user) {
    if(err) {return next(err)}
    this.username = user.username;
    if(!this.date) {
      this.date = Date.now();
    }
    next();
  });
});


module.exports = mongoose.model('Exercises', Exercises);