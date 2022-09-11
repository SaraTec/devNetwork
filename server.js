const express = require('express')
const connectDB = require('./config/db')
const path = require('path')

const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server)
// Connect Databese
connectDB();

//Init Middleware
app.use(express.json({ extended: false }))

const PORT = process.env.PORT || 5000;

//app.get('/', (req, res) => res.send('API Running'))

//Define Routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

const users = {};

/* users = {
  ["roomID"]: [
    ["userSocketID"]
  ]
} */

const socketToRoom = {};

io.on('connection', socket => {
  socket.on("join room", roomID => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  //#3
  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
  });

  //%5
  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter(id => id !== socket.id);
      users[roomID] = room;
    }
  });
});

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});