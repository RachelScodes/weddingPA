'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let accountSchema = new mongoose.Schema({

   greeting: String,
   users:[{
      type:[User],
      required:true
      max: 3
   }],
   guests:[{
        type: [User]
   }],
   created: Date,
   updated: Date
});

let Account = mongoose.model('Account', accountSchema);

module.exports = Account;
