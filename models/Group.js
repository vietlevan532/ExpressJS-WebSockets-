const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const Groups = new Schema({
  name: { type: String, required: true },
  members: [{ User, required: true }],
}, {
  timestamps: true
});

const Group = mongoose.model('Group', Groups);

module.exports = Group;
