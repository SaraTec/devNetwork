const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Room = require('../../Models/Room')

// @route   POST api/room
// @desc    Create a room
// @access  Private
router.post('/', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }


  const {
    roomId,
    title,
    desc,
    language,
    topics,
    language_levels
  } = req.body;

  const roomFields = {};

  roomFields.adminUser = req.user.id;
  if (title) roomFields.title = title;
  if (desc) roomFields.desc = desc;
  if (language) roomFields.language = language;
  if (topics) {
    roomFields.topics = topics;
  }
  if (language_levels) roomFields.language_levels = language_levels;

  try {
    let room = await Room.findById(roomId)

    if (room) {
      //Update
      room = await Room.findOneAndUpdate(
        { _id: roomId },
        { $set: roomFields },
        { new: true }
      );

      return res.json(room)
    }

    //Create
    const newRoom = new Room(roomFields)

    await newRoom.save();
    res.json(newRoom);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
  }
});

// @route   POST api/room/filter/
// @desc    Get filtered rooms
// @access  Private
router.post ('/filter', auth, async (req, res) => {
  try {
    const {
      language,
      topics,
      language_levels
    } = req.body;

    //console.log("req.body = ", req.body)
    let rooms = await Room.find();
    const filteredRooms = rooms.filter(room => {
      //console.log("room = ", room)
      return (language ? room.language.value === language.value : true) &&
      ((topics && topics.length) ? topics.some(({value : topicValue}) => room.topics.some(({value}) => value === topicValue)) : true) &&
      ((language_levels && language_levels.length) ? language_levels.some(({value : levelValue}) => room.language_levels.some(({value}) => value === levelValue)) : true)
    });

    //console.log("filteredRooms = ", filteredRooms)
    res.json(filteredRooms)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
  }
})

// @route   GET api/room
// @desc    Get all rooms
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let rooms = await Room.find();
    res.json(rooms)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
  }
})

// @route   GET api/room/:id
// @desc    Get room by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(400).send('Room not found');
    }

    res.json(room)
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).send('Room not found');
    }

    console.error(error.message);
    res.status(500).send('Server Error')
  }
})

// @route   DELETE api/room/:id
// @desc    Delete a room by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(400).send('Room not found');
    }

    //Check user
    if (room.adminUser.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not autorizedƒ' })
    }

    await room.remove();

    res.json({ msg: 'Room removed' })
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).send('Room not found');
    }

    console.error(error.message);
    res.status(500).send('Server Error')
  }
})

module.exports = router;
