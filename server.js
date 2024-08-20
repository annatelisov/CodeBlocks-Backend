const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

app.use(cors({
  //Allow my frontend, http://localhost:3000 for localhost
  origin: 'https://frontendcodeblocksapp-d21f3e724ed4.herokuapp.com', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const io = socketIo(server, {
  cors: {
    //Allow my frontend, http://localhost:3000 for localhost
    origin: 'https://frontendcodeblocksapp-d21f3e724ed4.herokuapp.com', 
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

// MongoDB connection
  mongoose.connect('mongodb+srv://annatelisov:A311016o@codeblocks-cluster.ovvx9.mongodb.net/codeblocks?retryWrites=true&w=majority', {})  
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// API routes
app.use('/api/codeblocks', require('./routes/codeblocks'));

var peoples;
var role;

// Socket.IO for real-time code updates
io.on('connection', (socket) => {
  socket.on('joinBlock', (blockId) => {
    //Check if someone already inside this room(codeblock)
    const room = io.sockets.adapter.rooms.get(blockId);
    //if not initialize 0 people
    peoples = room ? room.size : 0;
    //if this is the first person this is the mentor, if there is already people inside do this is a student
    if (peoples === 0) {
        role = 'mentor';
    } else {
        role = 'student';
    }
    socket.emit('roleAssignment', role);
    console.log(`User joined block ${blockId}. Role assigned: ${role}. Number of users: ${peoples}`);

    //join person to the room
    socket.join(blockId);
    //update count that 1 more student is in
    peoples = peoples + 1;
    if(role === 'student'){
      io.to(blockId).emit('studentsCount', peoples);
    }
});

  socket.on('codeChange', ({ blockId, code }) => {
    io.to(blockId).emit('updateCode', code);
  });

  socket.on('leaveBlock', (blockId) => {
    console.log('Someone disconnected');
    //update count that 1 less student is inside
    peoples = peoples - 1;
    io.to(blockId).emit('studentsCount', peoples);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));