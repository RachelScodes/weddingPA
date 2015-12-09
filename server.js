'use strict'

// require modules
const express    = require('express'),
      path       = require('path'),
      logger     = require('morgan'),
      request    = require('request'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser');



// start express
const app = express();

// log all the things
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// static files
app.use(express.static(path.join(__dirname, 'public')));



// database & mongoose
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/HoopHub');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
  console.log('mongoose connected');
})



// controllers
// const home = require('./routes/homeRoutes')
const user = require('./routes/userRoutes');

// routes
// app.use('/', home)
app.use('/user', user);



// SERVER
const server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('server running on port:',port);
});
