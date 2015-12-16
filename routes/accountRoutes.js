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
      account.signup(req, res);
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
      console.log('update account');
      account.update(req, res);
   })
   .delete('/', (req, res) => {
      debugger
      console.log('update account');
      account.destroy(req, res);
   });

// export
module.exports = router;
