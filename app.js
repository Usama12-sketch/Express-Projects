const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'chat-socket13-0-d1xp5x7gs-chodarykhan115-gmailcom.vercel.app', `${process.env.URL}`, 'https://chat-socket13-0.vercel.app', 'https://chat-socket13-0-ip6j.vercel.app/', 'https://chat-socket13-0.vercel.app/']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000','https://chat-socket13-0.vercel.app', '*'],
    methods: ['POST', 'GET']
  }
});

// Pass the `io` object to the routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log(`A user connected with socket id: ${socket.id}`);

  socket.on('chat message', (message) => {
    console.log('Received message:', message);
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log(`User with socket id ${socket.id} disconnected`);
  });
});

app.get('/', (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.post('/api/message', (req, res) => {
  const message = req.body.message;
  
  // Access the `io` object from the request object
  const io = req.io;
  
  // Emit the message to all connected sockets
  io.emit('chat message', message);
  
  // Return a response indicating success
  res.json({ message: 'Message sent successfully' });
});

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
