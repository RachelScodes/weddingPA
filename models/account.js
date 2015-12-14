'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let accountSchema = new mongoose.Schema({
   greeting: String,
   emails: Array,          // planner/bride/groom
   password: String,
   guests: {
      party: Number,       // id of account
      index: Number,       // id of guest[index]
      rsvp: Boolean,       // have they responded?
      name: String,        // Full name of guest
      email: String,       // guest email
      contact: [{
         // name: String,  // for multiple: selected from dropdown: Home, Work
         street_1: String,
         street_2: String,
         apt: String,
         city: String,
         state: String,    //selected from dropdown, will be 2 letters
         zip: Number,      // verify 5 digits
         phone: Number,    // verify 10 digits
         // first_emailed: Date,
         // last_emailed: Date
      }],
   },
});

accountSchema.pre('save', function(next){
   let account = this;

   if (!account.isModified('password')) return next();

   bcrypt.genSalt(7, function(err,salt){
      if (err) return next(err);
      bcrypt.hash(account.password, salt, function(err, hash){
         if (err) return next(err);

         account.password = hash;
         next();
      })
   })
});

accountSchema.methods.authenticate = function( password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(null, isMatch);
  });
};

let Account = mongoose.model('Account', accountSchema);

module.exports = Account;
