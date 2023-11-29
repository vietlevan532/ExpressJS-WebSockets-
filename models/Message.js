const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const Messages = new Schema({
  conversationId: { type: String, required: true },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  // sender: {type: Schema.Types.ObjectId, ref: 'User'},
  // status: { type: Boolean, required: true },
  // room: { type: Schema.Types.ObjectId, ref: 'Room' },
}, {
  timestamps: true
});

const Message = mongoose.model('Message', Messages);

module.exports = Message;
