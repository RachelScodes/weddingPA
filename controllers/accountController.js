'use strict'

//require modules and files
const express  = require('express'),
      mongoose = require('mongoose'),
      jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      Account     = require('../models/account.js');

// initialize app constants
const app      = express(),
      router   = express.Router();
      app.set('secret', secret);


let newAccount = function(data){
   let accountInfo = {
      emails: data.emails,
      password: data.password,
      greeting: data.greeting
   }

   let newAccount = new Account(accountInfo);
   let result = {
      success: undefined
   }
   newAccount.save((err) => {
      if(err) {
         console.log('oops!',err);
         result.success = false ;
      } else {
         console.log('saved a new account!');
         // send email to that account here?
         result.success = true
         result['data'] = accountInfo
      }
      return result
   });
}


let accountLogin = function(request,response) {
   let password = request.body.password,
          email = request.body.email;

   // search within 'emails' for the email entered
   Account.find({"emails": {"$regex": email, "$options": "i"} }, (err, account) => {
      debugger;
      if (err) { console.log(err) };
      if(!account) {
         // why don't the error messages print?
         response.status(401).send('There is no account associated with that email address.\nClick \"Sign up\" to create a profile.')
      }
      // check if password matches
      account[0].authenticate(password, (err, foundAccount) => {
         debugger;
         if (err) { console.log(err) };
         if (foundAccount) {
            response.status(200).json({
               account: account,
               success: true,
               message: 'you can ride the TRAIN with that token!',
               token: jwt.sign(account, app.get('secret'), { expiresIn: 3913 })
            })
         } else {
            // why don't the error messages print?
            response.status(401).send('Oops, something went wrong with your password.');
         }
      });
   });
}

module.exports = {
   accountLogin: accountLogin,
   newAccount: newAccount
}
