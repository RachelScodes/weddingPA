'use strict'

//require modules and files
const jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      Guest  = require('../models/guest.js'),
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
         response.status(200).json(newAccount)
      }
   });
}

let accountLogin = function(request,response) {
   if (request.body.email) {
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
            }) // end login
         }
      })
   } else if (request.body.accountId) {
      let accountId = request.body.accountId;
      Account.findById(accountId, (err, account) => {
         if (err) throw err;
         else if (account) {
            response.status(200).json({
               account: account,
               success: true,
               message: 'you can ride the TRAIN with that token!',
               token: jwt.sign(account, secret, { expiresIn: 3913 })
            })
         }
      }) // end login
   }
}

let updateAccount = function(request,response){
   let accountData = request.body;
   Account.findById(accountData.id, (err, account) => {
      if (err) throw err;
      if (!account) {
         response.status(401).send('There is no account associated with that id.')
      } else {
         account.emails = accountData.emails;
         account.greeting = accountData.greeting;
         account.password = accountData.password;
         account.save((err) => {
            if(err) throw err
            else {
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
      if (err) throw err
      else {
         account.remove((err) => {
            if (err) throw err
            else {
               request['account_info'] = account
               deleteGuests(request, response)
            }
         });
      }
   });
}

let deleteGuests = function(request, response){
   Guest.remove({account_id: request.body.accountId}, (err, guests) => {
      if (err) {
         response.send({
            'failed to delete guests': request.account_info,
            'error': err,
         })
      } else {
         request['guests'] = guests;
         deleteVendors(request, response)
      }
   })
}

let deleteVendors = function(request, response){
   Vendor.remove({account_id: request.body.accountId}, (err, vendors) => {
      if (err) {
         response.send({
            'failed to delete vendors': request.account_info,
            'error': err,
         })
      } else {
         response.send({
            'deleted guests': request['guests'],
            'deleted vendors': vendors
         })
      }
   })
}

let fetch = function(request, response){
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
