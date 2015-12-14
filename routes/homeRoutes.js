'use strict'

const express  = require('express'),
      jwt      = require('jsonwebtoken'),
      expjwt   = require('express-jwt'),
      mongoose = require('mongoose'),
      bcrypt   = require('bcrypt'),
      router   = express.Router();

let home = require('../controllers/homeController.js');

// i don't know how to implement this:
// const secret    = process.env.SECRET;

// home
router.get('/', (req, res, next) =>{
   console.log('hit /home');
});

// //user signup page
// router.get('/signup', (req, res, next) => {
//   res.render('users/signup.jade');
// });
//
// //create a user
// router.post('/', (req, res) => {
//   let newUser = new User({
//     username: req.body.username,
//     email:    req.body.email,
//     password: req.body.password
//   });
//
//   newUser.save((err) => {
//     if(err) throw err;
//     console.log('User was successfully created.');
//
//     res.status(200).json({
//       success: true,
//       message: 'User was successfully created.'
//     });
//     return res.render('signup', {newUser: newUser});
//
//   });
// });
//
// // var fake = {
// //   _id: '5654ff537b45878d111fb84b',
// //   username: 'bridge',
// //   email: 'bridge@gmail.com',
// //   password: 'bridge'
// // };
//
// // user authentication method
// router.post('/authenticate', (req, res) => {
//   let userInfo = {
//     email: req.body.email,
//     password: req.body.password
//   }
//
//   // validation for undefined email or password
//   if (userInfo.email == undefined || userInfo.password == undefined) {
//     res.status(401).send({ message: 'Credentials are incorrect'});
//   }
//
//   User.findOne({ email: userInfo.email }, (err, user) => {
//     // res.send({ isUser: true,
//     //             data: user});
//
//     user.authenticate(userInfo.password, function(err, isMatch) {
//       if(err) res.json({ error: true });
//       else {
//       // res.json({ res: isMatch });
//       // check if password match generated a token
//         if (isMatch) {
//           let token = jwt.sign(user, secret);
//           res.json({
//             success: true,
//             message: 'Got token!',
//             token: token
//           });
//         }
//         else {
//           res.status(401).send({ message: 'Credentials are incorrect' });
//         }
//       }
//     });
//   });
// });
// //
//
// // user login - note; add session + bcrypt[tokens]
// router.post('/login', (req, res, next) => {
//   // res.render('users/login.jade');
//   let userInfo = {
//     email: req.body.email,
//     password: req.body.password
//   };
//   User.findOne({ email: userInfo.email }, (err, user) => {
//     user.authenticate(userInfo.password, (err, isMatch) => {
//       if (err) throw err;
//       if (isMatch) {
//         return res.status(200).send({ message: 'authorized'});
//         return res.render('login', {userInfo: userInfo});
//       } else {
//         return res.status(401).send({ message: 'unauthorized'});
//       }
//     });
//   });
//   res.redirect('/sports/soccer');
// });
//
// // user sign out
// router.post('/logout', (req, res) => {
//   return ('Logout', 401, { 'WWW-Authenticate': 'Basic realm="Login required"' });
//   console.log('logged out');
// });
//
// // user show
// router.get('/:id', (req, res, next) => {
//   User.findOne({ _id: req.params.id }, (err, user) => {
//       if (err) throw err;
//       res.json(user);
//     });
// });
//
// // user edit
// router.put('/:id', (req, res, next) => {
//   User.findById(req.params.id, (err, user) => {
//     if(err) throw err;
//
//     if(req.body.username) user.username = req.body.username;
//     if(req.body.email) user.email = req.body.email;
//     if(req.body.password) user.password = req.body.password;
//
//     user.save((err) => {
//       if(err) throw err;
//       console.log('User was successfully updated.');
//
//       res.json({
//         success: true,
//         message: 'User was successfully updated.'
//       });
//     });
//   });
// });
//
// // delete a user
// router.delete('/:id', (req, res) => {
//   User.remove({ _id: req.params.id }, (err, user) => {
//     if(err) throw err;
//
//     res.json({
//       success: true,
//       message: 'User was successfully deleted.'
//     })
//   })
// })
//
//
// // protecting all relevant routes - TO DO: protect sports show news page
// // router.use(jwt({ secret: secret}) )
//


module.exports = router;
