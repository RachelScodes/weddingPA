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
   let email = req.body.email, password = req.body.password;
   res.json( account.accountLogin(email,password,'email_1') );
});

// // route middleware to verify token
// router.use((req, res, next) => {
//   let token = req.headers['x-access-token'];
//
//   if(token) {
//     jwt.verify(token, app.get('secret'), (err, decoded) => {
//
//       if(err) {
//         return res.json({
//             success: false,
//             message: 'Failed to authenticate token'
//         });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     return res.status(403).send({
//       success: false,
//       message: 'No token provided.'
//     });
//   }
// });

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
