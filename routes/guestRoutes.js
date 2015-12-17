'use strict'

//require modules and files
const secret   = require('../config').secret,
      router   = require('express').Router(),
      jwt      = require('jsonwebtoken'),
      guest    = require('../controllers/guestController.js');

// guest
router.get('/', (req, res, next) =>{
   console.log('hit \'GET\' \'/guest\'');
});

// public access
router
   .get('/rsvp/:accountId', (req, res) => {
      debugger
      console.log('fetch guest by id for rsvp');
      guest.fetch(req, res);
   })
   .get('/fetch/:accountId', (req, res) => {
      debugger
      console.log('fetch guest by id for svtd');
      guest.fetch(req, res);
   })
   .put('/rsvp', (req, res) => {
      console.log('update guest rsvp');
      guest.rsvp(req, res);
   })
   .put('/svtd', (req, res) => {
      debugger
      console.log('update guest svtd');
      guest.svtd(req, res);
   })

// private
router
   .put('/update', (req, res) => {
      console.log('update guest email');
      guest.updateGuest(req, res);
   })
   .get('/all/:id', (req, res) => {
      guest.guestList(req, res)
   })
   .post('/add', (req, res) => {
      console.log('hit POST \'/signup\'',req.body);
      guest.create(req, res);
   })
   .delete('/', (req, res) => {
      console.log('delete guest');
      guest.destroy(req, res);
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

module.exports = router;
