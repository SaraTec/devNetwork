const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  users: {
    type: [String],
  },
});

module.exports = Room = mongoose.model('room', RoomSchema)