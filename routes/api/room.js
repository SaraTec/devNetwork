const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
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
  try {
    const newRoom = new Room({
      adminUser: req.user.id
    })

    const room = await newRoom.save();
    res.json(room);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')
  }
});

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
