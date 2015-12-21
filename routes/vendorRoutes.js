'use strict'

//require modules and files
const secret   = require('../config').secret,
      router   = require('express').Router(),
      jwt      = require('jsonwebtoken'),
      vendor    = require('../controllers/vendorController.js');

// vendor
router.get('/', (req, res, next) =>{
   console.log('hit \'GET\' \'/vendor\'');
});

// private
router
   .get('/fetch/:vendorId', (req, res) => {
      console.log('fetch vendor by id for editing');
      vendor.fetch(req, res);
   })
   .get('/all/:id', (req, res) => {
      vendor.vendorList(req, res)
   })
   .get('/query/:sortTerm/:id', (req,res) => {
      vendor.querySort(req,res)
   })
   .get('/done/:id', (req,res) => {
      vendor.doneSearch(req,res)
   })
   .put('/update', (req, res) => {
      console.log('update vendor info');
      vendor.update(req, res);
   })
   .post('/add', (req, res) => {
      console.log('hit POST add vendor',req.body);
      vendor.create(req, res);
   })
   .delete('/', (req, res) => {
      console.log('delete vendor');
      vendor.destroy(req, res);
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
