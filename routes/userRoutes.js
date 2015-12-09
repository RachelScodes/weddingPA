'use strict'

//require modules and files
const express  = require('express'),
      mongoose = require('mongoose'),
      jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      User     = require('../models/user.js');
// const user     = require('../controllers/userController.js');

// initialize app constants
const app      = express(),
      router   = express.Router();
      app.set('secret', secret);


// routes!
router.get('/', (req, res) => {
   console.log('hit GET \'/\'');
   res.json({ success: true, message: 'got user?' });
});

router.post('/new', (req, res) => {
   console.log('hit POST \'/new\'');

   let email    = req.body.email,
       guest    = req.body.guest,
       greeting = req.body.greeting,
       password = (req.body.password) ? req.body.password : randomPassword();

   let newUser = new User({
      email: email,
      password: password,
      guest: guest,
      greeting: greeting
   });

   newUser.save((err) => {
      if(err) {
         console.log('oops!',err);
         res.json({ success: false });
      } else {
         console.log('saved a new user!');
         console.log(email,password);
         // send email to that user here?
         res.json({ success: true, email: email, password: password });
      }
   });
});

router.post('/authenticate', (req, res) => {
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
});

// route middleware to verify token
router.use((req, res, next) => {
  let token = req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, app.get('secret'), (err, decoded) => {

      if(err) {
        return res.json({
            success: false,
            message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// export
module.exports = router;

// helpers
let _ = require('underscore'),
randomPassword = function(){
   let randomstring = Math.random().toString(36);
   let passArr = randomstring.split('')
   passArr.splice(0, 2);
   let special = '!@#$%*_-+=?'
   passArr.push(special[Math.floor(Math.random()*special.length)])

   passArr = _.shuffle(passArr)

   return passArr.join('')
};
