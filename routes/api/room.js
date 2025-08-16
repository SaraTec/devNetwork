const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Room = require('../../Models/Room');

/**
 * @openapi
 * /api/room:
 *   post:
 *     summary: Create or update a room
 *     description: Якщо вказано `roomId`, оновлює кімнату, інакше створює нову.
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 example: "64b9f8c1234567890abcd123"
 *               title:
 *                 type: string
 *                 example: "English Conversation"
 *               desc:
 *                 type: string
 *                 example: "Room for English speaking practice"
 *               language:
 *                 type: object
 *                 example: { value: "en", label: "English" }
 *               topics:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: [{ value: "travel", label: "Travel" }]
 *               language_levels:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: [{ value: "B2", label: "Upper-Intermediate" }]
 *     responses:
 *       200:
 *         description: Room created or updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { roomId, title, desc, language, topics, language_levels } = req.body;
  const roomFields = {};
  roomFields.adminUser = req.user.id;
  if (title) roomFields.title = title;
  if (desc) roomFields.desc = desc;
  if (language) roomFields.language = language;
  if (topics) roomFields.topics = topics;
  if (language_levels) roomFields.language_levels = language_levels;

  try {
    let room = await Room.findById(roomId);
    if (room) {
      room = await Room.findOneAndUpdate({ _id: roomId }, { $set: roomFields }, { new: true });
      return res.json(room);
    }
    const newRoom = new Room(roomFields);
    await newRoom.save();
    res.json(newRoom);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @openapi
 * /api/room/filter:
 *   post:
 *     summary: Get filtered rooms
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: object
 *               topics:
 *                 type: array
 *               language_levels:
 *                 type: array
 *     responses:
 *       200:
 *         description: Filtered rooms list
 *       500:
 *         description: Server error
 */
router.post('/filter', auth, async (req, res) => {
  try {
    const { language, topics, language_levels } = req.body;
    let rooms = await Room.find();
    const filteredRooms = rooms.filter((room) => {
      return (
        (language ? room.language.value === language.value : true) &&
        (topics && topics.length
          ? topics.some(({ value: topicValue }) =>
              room.topics.some(({ value }) => value === topicValue)
            )
          : true) &&
        (language_levels && language_levels.length
          ? language_levels.some(({ value: levelValue }) =>
              room.language_levels.some(({ value }) => value === levelValue)
            )
          : true)
      );
    });
    res.json(filteredRooms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @openapi
 * /api/room:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rooms
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
  try {
    let rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @openapi
 * /api/room/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room found
 *       400:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(400).send('Room not found');
    }
    res.json(room);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).send('Room not found');
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @openapi
 * /api/room/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     tags:
 *       - Room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Room ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room removed
 *       400:
 *         description: Room not found
 *       401:
 *         description: User not authorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(400).send('Room not found');
    }
    if (room.adminUser.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not autorizedƒ' });
    }
    await room.remove();
    res.json({ msg: 'Room removed' });
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).send('Room not found');
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
