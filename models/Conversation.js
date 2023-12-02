const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const Conversations = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  // sender: {type: Schema.Types.ObjectId, ref: 'User'},
  // status: { type: Boolean, required: true },
  // room: { type: Schema.Types.ObjectId, ref: 'Room' },
}, {
  timestamps: true
});

const Conversation = mongoose.model('Conversation', Conversations);

module.exports = Conversation;
