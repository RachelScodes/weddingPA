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


let accountLogin = function(e,p) {
   let result = {};
   // search within emails for email
   Account.find({"emails": {"$regex": e, "$options": "i"} }, (err, account) => {
      if(err) throw err;
      if(!account) {
         result = {
            success: false,
            message: 'There is no account associated with that email address.\nClick \"Sign up\" to create a profile.'
         }
         console.log('accountController line 57',result);
      } else {
         // check if password matches
         account[0].authenticate(p, (err, foundAccount) => {
            if (err) throw err;
            if (foundAccount) {
               let token = jwt.sign(account, app.get('secret'), { expiresIn: 3913 });
               result = {
                  account: account,
                  success: true,
                  message: 'you can ride the TRAIN with that token!',
                  token: token
               };
               console.log('accountController line 65',result);
            } else {
               result = {
                  success: false,
                  message: 'Oops, something went wrong with your password.'
               };
               console.log('accountController line 71',result);
            }
         });
      }
   });
}


module.exports = {
   accountLogin: accountLogin,
   newAccount: newAccount
}
