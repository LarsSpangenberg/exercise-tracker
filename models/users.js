const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shortid = require('shortid');

let Users = new Schema({
  username: {
    type: String, 
    required: true,
    unique: true,
    maxlength: [15, 'too many characters']
  },
  _id: {
    type: String,
    index: true,
    default: shortid.generate
  }
});

module.exports = mongoose.model('Users', Users);