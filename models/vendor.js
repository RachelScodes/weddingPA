'use strict'

let mongoose = require('mongoose');

let vendorSchema = new mongoose.Schema({
   // link to id of account
   account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
   },
   // have they responded?
   // responded: {type: Boolean, default: false},
   businessName: String,        // Full name of vendor
   businessType: String,// selected from dropdown,
   price: String,
   contact: {
      person: String,
      email: String,
      phone: String,
      street_1: String,
      street_2: String,
      apt: String,
      city: String,
      state: String,    //selected from dropdown, will be 2 letters
      zip: String
   },
   paid: {type: Boolean, default: false},
   datePaid: Date,
   notes: String
})

// notes form previous app
// RoomSchema.statics.nameIs = function(name,cb) {
//    this.db.model('Room').findOne({ name: new RegExp(name, 'i') },cb);
// }

let Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
