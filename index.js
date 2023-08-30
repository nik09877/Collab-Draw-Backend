const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const server = http.createServer(app);

app.use(cors());

let elements = [];

//CREATE Socket.io SERVER
const io = new Server(server, {
  cors: {
    origin: '*', //allow all connections
    methods: ['GET', 'POST'],
  },
});

//WHEN A USER CONNECTS
io.on('connection', (socket) => {
  console.log('user connected');

  // send the elements to individual socketid (private message)
  io.to(socket.id).emit('whiteboard-state', elements);

  //when a client updates an element
  socket.on('element-update', (elementData) => {
    updateElementInElements(elementData);

    //emit this to all clients except the client who sent it
    socket.broadcast.emit('element-update', elementData);
  });

  socket.on('whiteboard-clear', () => {
    elements = [];
    //emit this to all clients except the client who sent it
    socket.broadcast.emit('whiteboard-clear');
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected`);
  });
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => console.log(`listening on port ${PORT}`));

const updateElementInElements = (elementData) => {
  //TODO uncomment if not working
  // const index = elements.findIndex((element) => element.ud === elementData.id);

  // if (index === -1) return elements.push(elementData);

  // elements[index] = elementData;
  elements = elementData;
};
