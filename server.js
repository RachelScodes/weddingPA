'use strict'

const express    = require('express'),
      path       = require('path'),
      logger     = require('morgan');


const app = express();

app.use(logger('dev'));

// static files
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', express.static('public'));

let home    = require('./routes/homeRoutes.js');
app.use('/home', home);

// SERVER
const server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log('server running');
});
