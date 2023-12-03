const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conversations = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
}, {
  timestamps: true
});

const Conversation = mongoose.model('Conversation', Conversations);

module.exports = Conversation;
