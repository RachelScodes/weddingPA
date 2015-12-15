'use strict'

// require modules
const express    = require('express'),
      path       = require('path'),
      logger     = require('morgan'),
      request    = require('request'),
      mongoose   = require('mongoose'),
      bodyParser = require('body-parser');

// i don't know how to implement this:
const secret    = process.env.SECRET;

// start express
const app = express();

// log all the things
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

// static files
app.use(express.static(path.join(__dirname, 'public')));



// database & mongoose
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ptwfm');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
  console.log('mongoose connected');
})



// controllers
let home    = require('./routes/homeRoutes');
let account = require('./routes/accountRoutes');

// routes
app.use('/', home)
app.use('/account', account);



// SERVER
const server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('server running on port:',port);
});
