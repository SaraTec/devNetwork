const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const helmet= require('helmet');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
// Connect Databese
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5500;

//app.get('/', (req, res) => res.send('API Running'))

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Документація для мого API',
    },
    servers: [
      {
        url: 'http://localhost:' + PORT,
      },
    ],
  },
  apis: ['./routes/api/*.js'], // шукатиме JSDoc-коментарі в усіх роутах
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 🔹 Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Define Routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/room', require('./routes/api/room'));

const Room = require('./Models/Room');

const socketToRoom = {};

io.on('connection', (socket) => {
  socket.on('join room', async (roomID) => {
    const room = await Room.findById(roomID);
    console.log('users = ', room);
    if (room) {
      const length = room.users.length;
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      room.users.push(socket.id);
    } else {
      room.users = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = room.users.filter((id) => id !== socket.id);
    room.save();
    socket.emit('all users', usersInThisRoom);
  });

  //#3
  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  //%5
  socket.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });

  //%5
  socket.on('kick user', (payload) => {
    io.to(payload.peerID).emit('leave room', {});
  });

  socket.on('disconnect', async () => {
    const roomID = socketToRoom[socket.id];
    const room = await Room.findById(roomID);
    let users = room.users;

    if (users) {
      users = users.filter((id) => id !== socket.id);
      users.forEach((userId) => {
        io.to(userId).emit('remove user', { id: socket.id });
      });
      room.users = users;
      room.save();
    }
  });
});


// Secure headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // мозволяє завантажувати скрипти стилі і зображення тільки з мого домену
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        frameAncestors: ["'none'"], // захист від iframe embedding
      },
    },
    frameguard: { action: 'deny' },  // X-Frame-Options: DENY
    hsts: { maxAge: 31536000, includeSubDomains: true }, // змушує браузер завжди використовувати HTTPS
  })
);

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
