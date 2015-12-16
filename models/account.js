'use strict'

let mongoose = require('mongoose'),
    bcrypt   = require('bcrypt');

let accountSchema = new mongoose.Schema({
   greeting: {type: String, required: true},
   emails: {type: String, required: true, unique: true}, // planner/bride/groom
   password: {type: String, required: true}
});

accountSchema.pre('save', function(next){
   let account = this;
   if (!account.isModified('password')) return next();

   bcrypt.genSalt(13, function(err,salt){
      if (err) return next(err);
      bcrypt.hash(account.password, salt, function(err, hash){
         if (err) return next(err);
         account.password = hash;
         next();
      })
   })
});

accountSchema.methods.login = function( password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(null, isMatch);
  });
};

let Account = mongoose.model('Account', accountSchema);

module.exports = Account;
