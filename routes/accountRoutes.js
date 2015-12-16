'use strict'

//require modules and files
const secret   = require('../config').secret,
      router   = require('express').Router(),
      account  = require('../controllers/accountController.js'),
      eJwt     = require('express-jwt');

// initialize app constants
// const app      = express();
//       app.set('secret', secret);

router
   .post('/signup', (req, res) => {
      console.log('hit POST \'/signup\'',req.body);
      res.json( account.signup(req.body) )
   })
   .post('/login', (req, res) => {
      console.log('hit POST \'/login\'');
      account.login(req, res);
   });


/////////////////////////////////
////// TODO: VERIFY THESE ///////
/////////////////////////////////

// show/edit and delete account
router
   .get('/search/:accountId', (req, res) => {
      console.log('fetch account');
      account.fetch(req, res);
   })
   .put('/', (req, res) => {
      debugger
      console.log('update account');
      account.update(req, res);
   })
   .delete('/', (req, res) => {
      debugger
      console.log('update account');
      account.destroy(req, res);
   });

// send emails
// public access via secure link
// app.get('/guest/:guest_id', function(req,res){
//    console.log('hit get guest form route');
//    // WRITE THIS FUNCTION:
//    // account.findGuest(req.params);
// })

// export
module.exports = router;
