'use strict'

//require modules and files
const express  = require('express'),
      mongoose = require('mongoose'),
      jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      User     = require('../models/user.js');

// initialize app constants
const app      = express(),
      router   = express.Router();
      app.set('secret', secret);


let newUser = function(req,res){
      console.log('hit POST \'/authenticate\'');
      console.log(req.body.email,req.body.password);
      User.findOne({
         email: req.body.email
      }, (err, user) => {
         if(err) throw err;
         // user doesn't exist in our database
         if(!user) {
            res.json({
              success: false,
              message: 'There is no account associated with that email address.\nClick \"Sign up\" to create a profile.'
            });
            console.log(res.json);
         } else {
            // check if password matches
            user.authenticate(req.body.password, (err, foundUser) => {
               if (err) throw err;

               if (foundUser) {
                  let token = jwt.sign(user, app.get('secret'), { expiresIn: 3913 });

                  res.json({
                     user: user,
                     success: true,
                     message: 'you can ride the TRAIN with that token!',
                     token: token
                  });
                  console.log(res.json);
               } else {
                  res.json({
                     success: false,
                     message: 'Oops, something went wrong with your password.'
                  });
                  console.log(res.json);
               }
            });
         }
      });
   }
}
