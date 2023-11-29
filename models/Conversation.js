const mongoose = require('mongoose');
const Message = require('./Message');
const Schema = mongoose.Schema;

const Conversations = new Schema({
    members: {type: Array},
    // messages: [Message],
}, {
    timestamps: true
});

const Conversation = mongoose.model('Conversation', Conversations);

module.exports = Conversation;
