const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  username: { type: String, required: true },
  password: {type: String, required: true},
  gender: {type: String, required: true},
  avatar: { type: String },
  // relationship: { type: String },
  // serverId: { type: String, required: true},
  // friendList: [{type: Object}],
  status: { type: Boolean, required: true, default: false },
  //lastActive: { type: Date.now() },
}, {
  timestamps: true
});

const User = mongoose.model('User', Users);

module.exports = User;
