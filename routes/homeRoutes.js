'use strict'

//require modules and files
const express  = require('express'),
      mongoose = require('mongoose'),
      router   = express.Router();

let home = require('../controllers/homeController.js');

// i don't know how to implement this:
// const secret    = process.env.SECRET;

// home
router.get('/', (req, res, next) =>{
   console.log('hit \'GET\' \'/\'');
});


module.exports = router;
