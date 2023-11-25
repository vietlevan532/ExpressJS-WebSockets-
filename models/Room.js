const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const Rooms = new Schema({
  name: { type: String, required: true },
  member: [{User, required: true}],
  status: { type: Boolean, required: true },
}, {
  timestamps: true
});

const Room = mongoose.model('Room', Rooms);

module.exports = Room;
