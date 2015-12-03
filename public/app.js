'use strict'

let _ = require('underscore');

let randomPassword = function(){
   let randomstring = Math.random().toString(36);
   let passArr = randomstring.split('')
   passArr.splice(0, 2);
   let special = '!@#$%*_-+=?'
   passArr.push(special[Math.floor(Math.random()*special.length)])

   passArr = _.shuffle(passArr)

   return passArr.join('')
}
