'use strict'

//require modules and files
const express  = require('express'),
      mongoose = require('mongoose'),
      jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      bcrypt   = require('bcrypt'),
      account  = require('../controllers/accountController.js'),
      router   = express.Router();

// initialize app constants
const app      = express();
      app.set('secret', secret);


// routes!
router.get('/', (req, res) => {
   console.log('hit GET \'/account\'');
   res.json({ success: true, message: 'got account?' });
});

router.post('/new', (req, res) => {
   console.log('hit POST \'/new\'',req.body);
   res.json( account.newAccount(req.body) )
});

router.post('/authenticate', (req, res) => {
   console.log('hit POST \'/authenticate\'');
   account.accountLogin(req, res);
});


/////////////////////////////////
//////////// TO DO //////////////
/////////////////////////////////

// edit guest list

// send emails

// public access via secure link
// app.get('/guest/:account_id/:guest_id/:timer', function(req,res){
app.get('/guest/:account_id/:guest_id', function(req,res){
   console.log('hit get guest form route');
   // WRITE THIS FUNCTION:
   // account.findGuest(req.params);
})

// export
module.exports = router;

// helpers
let _ = require('underscore');

// DEPRECATED:
//
// randomPassword = function(){
//    let randomstring = Math.random().toString(36);
//    let passArr = randomstring.split('')
//    passArr.splice(0, 2);
//    let special = '!@#$%*_-+=?'
//    passArr.push(special[Math.floor(Math.random()*special.length)])
//
//    passArr = _.shuffle(passArr)
//
//    return passArr.join('')
// };
