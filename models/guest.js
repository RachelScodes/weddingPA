'use strict'

let mongoose = require('mongoose');

let guestSchema = new mongoose.Schema({
   // link to id of account
   account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
   },
   // have they responded?
   // responded: {type: Boolean, default: false},
   fullName: String,        // Full name of guest
   email: String,       // guest email
   svtd: {
      finished: {type: Boolean, default: false},
      street_1: String,
      street_2: String,
      apt: String,
      city: String,
      state: String,    //selected from dropdown, will be 2 letters
      zip: String,      // verify 5 digits
      phone: String,    // verify 10 digits
      notes: String
      // first_emailed: Date,
      // last_emailed: Date
   },
   rsvp: {
      finished: {type: Boolean, default: false},
      attending: Boolean,
      entree: String,   // selected from dropdown,
      diet: String,
      plus: Boolean,
      entreep: Number,
      dietp: String,
      song: String,
      message: String
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

// notes form previous app
// RoomSchema.statics.nameIs = function(name,cb) {
//    this.db.model('Room').findOne({ name: new RegExp(name, 'i') },cb);
// }

let Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
