const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blocks = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  blockUser: { type: Schema.Types.ObjectId, required: true, ref: 'Block User' },
}, {
  timestamps: true
});

const Block = mongoose.model('Block', Blocks);

module.exports = Block;
