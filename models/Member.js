const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Members = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: 'Group' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  }, {
  timestamps: true
});

const Member = mongoose.model('Member', Members);

module.exports = Member;
