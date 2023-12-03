const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema({
  creator_id: {type: Schema.Types.ObjectId, ref: 'Creator'},
  name: { type: String, required: true },
  image: {type: String, required: true},
  limit: { type: Number, required: true },
}, {
  timestamps: true
});

const Group = mongoose.model('Group', Groups);

module.exports = Group;
