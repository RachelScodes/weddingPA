'use strict'

//require modules and files
const jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      Account  = require('../models/account.js');

let newAccount = function(request, response){
   console.log('inside account controller line 9');
   let newAccount = new Account({
      emails: request.body.emails,
      password: request.body.password,
      greeting: request.body.greeting
   })
   newAccount.save((err) => {
      if(err) throw err;
      else {
         console.log('saved a new account!');
         // send email to that account here?
         res.json({
            success: true,
            account: account
         })
      }
      return result
   });
}

let accountLogin = function(request,response) {
   debugger
   let password = request.body.password,
          email = request.body.email;
   // search within 'emails' for the email entered
   Account.find({"emails": {"$regex": email, "$options": "i"} }, (err, account) => {
      // why don't the error messages print?
      if (err) throw err;
      if (!account || !account[0]) {
         response.status(401).send('There is no account associated with that email address.\nClick \"Sign up\" to create a profile.')
      } else {
         // check if password matches
         account[0].login(password, (err, foundAccount) => {
            if (err) {
               response.send(err)
            } else if (foundAccount) {
               response.status(200).json({
                  account: account[0],
                  success: true,
                  message: 'you can ride the TRAIN with that token!',
                  token: jwt.sign(account, secret, { expiresIn: 3913 })
               })
            } else {
               // why don't the error messages print?
               response.status(401).send('Oops, something went wrong with your password.');
            }
         }); // end login
      }
   });
}

let updateAccount = function(request,response){
   debugger
   let accountData = request.body;
   Account.findById(accountData.id, (err, account) => {
      if (err) throw err;
      if (!account || !account[0]) {
         response.status(401).send('There is no account associated with that email address.\nClick \"Sign up\" to create a profile.')
      } else {
         account.emails = accountData.emails;
         account.greeting = accountData.greeting;
         account.password = accountData.password;
         account.save((err) => {
            if(err) {
               console.log('oops!',err);
               response.send(err)
            } else {
               console.log('saved a new account!');
               // send email to that account here?
               response.status(200).json(account)
            }
         });
      }
   });
}

let kaBLAMO = function(request,response){
   let accountId = request.body.accountId;
   Account.findByIdAndRemove(accountId, (err, account) => {
      if (err) throw err;
      account.remove((err) => {
         response.send({ "deleted" : account });
      });
   });
}

let fetch = function(request, response){
   console.log(request.params);
   let accountId = request.params.accountId;
   Account.findById(accountId, (err, account) => {
      if (err) throw err;
      response.json(account);
   })
}
module.exports = {
   login: accountLogin,
   signup: newAccount,
   update: updateAccount,
   destroy: kaBLAMO,
   fetch: fetch
}
