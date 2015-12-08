'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
   email: String,
   password: String,
   accounts: [{ //user can be admin or guest. admin of one account could be guest of another
      _id: Number,
      guest: Boolean
   }],
   response: {
      done: Boolean,
      when: Date,
      contact: [{
         name: String, // selected from dropdown: Home, Work, Return (for couples)
         street_one: String,
         street_two: String,
         apt: String,
         city: String,
         state: String, //selected from dropdown, will be 2 letters
         zip: Number,
         phone: Number
      }],
   },

   first_emailed: Date,
   last_emailed: Date
});

userSchema.pre('save', function(next){
   let user = this;

   if (!user.isModified('password')) return next();

   bcrypt.genSalt(5, function(err,salt){
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash){
         if (err) return next(err);

         user.password = hash;
         next();
      })
   })
});

userSchema.methods.authenticate = function( password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(null, isMatch);
  });
};

// UserSchema.plugin(require('mongoose-role'), {
//   roles: ['guest', 'couple', 'admin'],
//   accessLevels: {
//     'guest': ['guest'],
//     'couple': ['guest', 'couple'],
//     'admin': ['admin']
//   }
// });

let User = mongoose.model('User', userSchema);

let accountSchema = new mongoose.Schema({
  greeting: String,
  users:[{
      type: [User],
      required: true,
      max: 3
  }],
  guests:[{
      type: [User]
  }],
  created: Date,
  updated: Date
});

let Account = mongoose.model('Account', accountSchema);

module.exports = {User,Account};
