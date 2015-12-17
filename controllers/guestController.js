'use strict'

//require modules and files
const jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      Guest  = require('../models/guest.js'),
      Account  = require('../models/account.js');

let newGuest = function(request, response){
   console.log('inside guest controller line 10');
   if (request.body.myAccount) {
      Account.findById(request.body.myAccount, (err, account) => {
         if (err) throw err
         else if (account) {
            request.myAccount = account._id
            saveGuest(request, response)
         }
      })
   } else {
      response.status(401).json({ 'success': false })
   }
}

let saveGuest = function(request,response) {
   let data = request.body
   let newGuest = new Guest({
      account_id: data.myAccount,
      fullName: data.fullName,
      email: data.email
   })
   newGuest.save((err) => {
      if(err) throw err;
      else {
         console.log('saved a new guest!');
         response.status(200).json(newGuest)
      }
   });
}

let updateSvtd = function(request,response){
   debugger
   let contactInfo = request.body;
   Guest.findById(contactInfo.id, (err, guest) => {
      if (err) throw err;
      if (!guest) {
         response.status(401).send('There is no guest associated with that id.')
      } else {
         guest['fullName'] = guestData['fullName'];
         guest['svtd']['finished'] = true;
         guest['svtd']['street_1'] = guestData['street_1'];
         guest['svtd']['street_2'] = guestData['street_2'];
         guest['svtd']['apt'] = guestData['apt'];
         guest['svtd']['city'] = guestData['city'];
         guest['svtd']['state'] = guestData['state'];
         guest['svtd']['zip'] = guestData['zip'];
         guest['svtd']['phone'] = guestData['phone'];
         guest['svtd']['notes'] = guestData['notes'];

         guest.save((err) => {
            if(err) throw err
            else {
               console.log('you rsvp\'d!');
               // send email to that guest here?
               response.status(200).json(guest)
            }
         });
      }
   });
}

let updateRsvp = function(request,response){
   debugger
   let contactInfo = request.body;
   Guest.findById(contactInfo.id, (err, guest) => {
      if (err) throw err;
      if (!guest) {
         response.status(401).send('There is no guest associated with that id.')
      } else {
         guest['fullName'] = guestData['fullName'];
         guest['rsvp']['finished'] = true;
         guest['rsvp']['attending'] = guestData['attending'];
         guest['rsvp']['entree'] = guestData['entree'];
         guest['rsvp']['diet'] = guestData['diet'];
         guest['rsvp']['plus'] = guestData['plus'];
         guest['rsvp']['entreep'] = guestData['entreep'];
         guest['rsvp']['dietp'] = guestData['dietp'];
         guest['rsvp']['song'] = guestData['song'];
         guest['rsvp']['message'] = guestData['message'];

         guest.save((err) => {
            if(err) throw err
            else {
               console.log('you rsvp\'d!');
               // send email to that guest here?
               response.status(200).json(guest)
            }
         });
      }
   });
}

let updateEmail = function(request,response){
   debugger
   let updateInfo = request.body;
   Guest.findById(updateInfo.id, (err, guest) => {
      if (err) throw err;
      if (!guest) {
         response.status(401).send('There is no guest associated with that id.')
      } else {
         guest['account_id'] = updateInfo.myAccount,
         guest['fullName'] = updateInfo.fullName
         guest['email'] = updateInfo.email

         guest.save((err) => {
            if(err) throw err
            else {
               console.log('updated guest!');
               response.status(200).json(guest)
            }
         });
      }
   });
}

let fetchOne = function(request,response){
   let guestId = request.params.accountId
   Guest.findById(guestId, (err, guest) => {
      if (err) throw err;
      if (!guest) {
         response.status(401).send('There is no guest associated with that id.')
      } else {
         response.status(200).json(guest)
      }
   });
}

let getAll = function(request,response){
   let account = request.params.id
   let guestList = Guest.find({account_id: account}).sort({fullName: 1});
   guestList.exec((err, guests) => {
      if (err) throw err
      response.json(guests);
   })
}

let destroy = function(request,response){
   debugger
   var guestId = request.body.guestId;
   Guest.remove({_id: guestId}, function(err) {
      debugger
      if (err) response.json({message: err + '. Could not delete guest'});
      else response.json({message: 'guest deleted'})
   });

}



module.exports = {
   rsvp: updateRsvp,
   svtd: updateSvtd,
   fetch: fetchOne,
   // privatize:
   updateGuest: updateEmail,
   guestList: getAll,
   create: newGuest,
   destroy: destroy
}
