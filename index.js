const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const httpServer = require('http').createServer(app);
const routerApi = require('./routes');
const cors = require('cors');
const passport = require('passport');

const { errorHandler, logErrors, boomErrorHandler, sequelizeErrorHandler } = require('./middlewares/error.handler');
const { application_name } = require('pg/lib/defaults');

const options = {
  cors: {
    origin: '*',
  },
};

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
const io = require('socket.io')(httpServer, options);
io.use(wrap(passport.initialize()));
io.use(wrap(passport.authenticate('jwt', { session: false })));
io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    if (room) {
      socket.join(room);
      console.log('User ' + socket.id + ' Joined Room: ' + room);
    }
  });

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.id;
    console.log('mesasge in chat id ' + chat);
    if (!chat) return console.log('chat not defined');
    socket.in(chat).emit('message received', newMessageRecieved);
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
  });

  socket.on('disconnect', (socket) => {
    console.log('disconnected');
  });
});

io.on('notification', (socket) => {
  console.log('disoncee');
});
//express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

require('./utils/auth');

routerApi(app); // initialize the router

// middleware to handle errors
app.use(logErrors);
app.use(boomErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

httpServer.listen(port, () => console.log('Listening on port 3000'));
