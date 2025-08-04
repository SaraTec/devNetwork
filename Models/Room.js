const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  topics: [
    {
      value: {
        type: String,
      },
      label: {
        type: String,
      },
    },
  ],
  language: {
    value: {
      type: String,
    },
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  language_levels: [
    {
      value: {
        type: String,
      },
      label: {
        type: String,
      },
    },
  ],
  users: {
    type: [String],
  },
});

module.exports = Room = mongoose.model('room', RoomSchema);
