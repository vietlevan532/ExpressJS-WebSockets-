const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Friendships = new Schema({
  user1: { type: Schema.Types.ObjectId, required: true, ref: 'User1' },
  user2: { type: Schema.Types.ObjectId, required: true, ref: 'User2' },
  status: { type: String, enum: ['Accept', 'Pending'], default: 'Pending'}
}, {
  timestamps: true
});

const Friendship = mongoose.model('Friendship', Friendships);

module.exports = Friendship;
