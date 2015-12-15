'use strict'
let mongoose = require('mongoose'),
    Account  = require('./account.js');

let guestSchema = new mongoose.Schema({
   // link to id of account
   account_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
   // have they responded?
   rsvp: {type: Boolean, default: false},
   name: String,        // Full name of guest
   email: String,       // guest email
   contact: {
      street_1: String,
      street_2: String,
      apt: String,
      city: String,
      state: String,    //selected from dropdown, will be 2 letters
      zip: String,      // verify 5 digits
      phone: Number,    // verify 10 digits
      // first_emailed: Date,
      // last_emailed: Date
   }
})

// verify these on front-end
// rsvp: {type: Boolean, default: false},       // have they responded?
// name: {type: String, required: true},        // Full name of guest
// email: {type: String, required: true},       // guest email
// contact: {
//    // name: String,  // for multiple: selected from dropdown: Home, Work
//    street_1: {type: String, required: true},
//    street_2: String,
//    apt: String,
//    city: {type: String, required: true},
//    state: {type: String, required: true},    //selected from dropdown, will be 2 letters
//    zip: {type: String, required: true},      // verify 5 digits
//    phone: Number,    // verify 10 digits
//

RoomSchema.statics.nameIs = function(name,cb) {
   this.db.model('Room').findOne({ name: new RegExp(name, 'i') },cb);
}
