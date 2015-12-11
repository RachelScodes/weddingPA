'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let accountSchema = new mongoose.Schema({
   greeting: String,
   email_1: String, // planner
   email_2: String, // bride/groom 1
   email_3: String, // bride/groom 2
   password: String,
   guests: {
      party: Number,
      id: Number,
      rsvp: Boolean,
      name: String,
      email: String,
      contact: [{
         name: String, // selected from dropdown: Home, Work
         street_one: String,
         street_two: String,
         apt: String,
         city: String,
         state: String, //selected from dropdown, will be 2 letters
         zip: Number,
         phone: Number,
         first_emailed: Date,
         last_emailed: Date
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
