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

//MongoDB connection
  mongoose.connect('mongodb+srv://annatelisov:A311016o@codeblocks-cluster.ovvx9.mongodb.net/codeblocks?retryWrites=true&w=majority', {})  
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


//API routes
app.use('/api/codeblocks', require('./routes/codeblocks'));

//Socket.IO for real-time code updates
io.on('connection', (socket) => {
  let currentRole;

  socket.on('joinBlock', (blockId) => {
    socket.join(blockId);

    //Check the number of people in the room
    const room = io.sockets.adapter.rooms.get(blockId);
    const numberOfUsers = room ? room.size : 0;

    //Define roles based on this if this first person in room or not
    if (numberOfUsers === 1) {
      currentRole = 'mentor';
    } else {
      currentRole = 'student';
    }

    socket.emit('roleAssignment', currentRole);

    //Update the student number for all users in this room without the mentor
    if (currentRole === 'student') {
      io.to(blockId).emit('studentsCount', numberOfUsers - 1); 
    }
  });

  socket.on('codeChange', ({ blockId, code }) => {
    io.to(blockId).emit('updateCode', code);
  });

  socket.on('leaveBlock', (blockId) => {
    console.log("disconnect");
    //Update the number of people in the room after a student leaves
    const room = io.sockets.adapter.rooms.get(blockId);
    const numberOfUsers = room ? room.size : 0;

    if (currentRole === 'mentor') {
      //If the mentor leaves, close the room for everyone
      io.to(blockId).emit('roomClosed');
      io.socketsLeave(blockId);
    } else {
      //If student leaves, update number of students in room
      io.to(blockId).emit('studentsCount', numberOfUsers - 2); 
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));