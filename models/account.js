'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let accountSchema = new mongoose.Schema({

  greeting: String,
  users:{
      type:[User],
      required:true
  },

  first_emailed: Date,
  last_emailed: Date
});

let Account = mongoose.model('Account', accountSchema);

module.exports = Account;
