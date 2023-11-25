const mongoose = require('mongoose');
const Message = require('./Message');
const Schema = mongoose.Schema;

const Conversations = new Schema({
  messages: [Message],
}, {
  timestamps: true
});

const Conversation = mongoose.model('Room', Conversations);

module.exports = Conversation;
