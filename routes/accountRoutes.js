'use strict'

//require modules and files
const secret   = require('../config').secret,
      router   = require('express').Router(),
      jwt      = require('jsonwebtoken'),
      account  = require('../controllers/accountController.js');

// public
router
   .post('/signup', (req, res) => {
      console.log('hit POST \'/signup\'',req.body);
      account.signup(req, res);
   })
   .post('/login', (req, res) => {
      console.log('hit POST \'/login\'');
      account.login(req, res);
   });

// private
router.use((req, res, next) => {
  let token = req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, secret, (err, decoded) => {

      if(err) {
        res.json({
            success: false,
            message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// show/edit/delete account
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
      console.log('update account');
      account.destroy(req, res);
   });

// export
module.exports = router;
