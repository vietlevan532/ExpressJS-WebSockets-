const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  avatar: { type: String },
  username: { type: String, required: true },
  password: {type: String, required: true},
  status: { type: Boolean, required: true },
  lastActive: { type: Date.now(), required: true}
}, {
  timestamps: true
});

const User = mongoose.model('User', Users);

module.exports = User;
