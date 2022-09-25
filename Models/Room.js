const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
  },
  topics: {
    type: [String],
  },
  language_levels: {
    type: [String]
  },
  users: {
    type: [String],
  },
});

module.exports = Room = mongoose.model('room', RoomSchema)