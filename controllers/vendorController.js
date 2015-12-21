'use strict'

//require modules and files
const jwt      = require('jsonwebtoken'),
      secret   = require('../config').secret,
      Vendor  = require('../models/vendor.js'),
      Account  = require('../models/account.js');


let newVendor = function(request, response){
   // Save a new vendor to the correct account
   console.log('inside vendor controller line 10');
   if (request.body.myAccount) {
      Account.findById(request.body.myAccount, (err, account) => {
         if (err) throw err
         else if (account) {
            request.myAccount = account._id
            saveVendor(request, response)
         }
      })
   } else {
      response.status(401).json({ 'success': false })
   }
}
let saveVendor = function(request,response) {
   // Store a new vendor with account reference
   let data = request.body
   let newVendor = new Vendor({
      account_id: data.myAccount,
      businessName: data.bName, // Full name of vendor
      businessType: data.bType, // selected from dropdown,
      price: data.price,
      contact: {
         person: data.person,
         email: data.email,
         phone: data.phone,
         street_1: data.street_1,
         street_2: data.street_2,
         apt: data.apt,
         city: data.city,
         state: data.state,    //selected from dropdown, will be 2 letters
         zip: data.zip
      },
      notes: data.notes
   })
   newVendor.save((err) => {
      if(err) throw err;
      else {
         console.log('saved a new vendor!');
         response.status(200).json(newVendor)
      }
   });
}
let updateVendor = function(request,response){
   let data = request.body;
   Vendor.findById(vendorData.id, (err, vendor) => {
      if (err) throw err;
      if (!vendor) {
         response.status(401).send('There is no vendor associated with that id.')
      } else {
         vendor.account_id = data.myAccount,
         vendor.businessName = data.bName, // Full name of vendor
         vendor.businessType = data.bType, // selected from dropdown,
         vendor.price = data.price,
         vendor.contact.person = data.person,
         vendor.contact.email = data.email,
         vendor.contact.phone = data.phone,
         vendor.contact.street_1 = data.street_1,
         vendor.contact.street_2 = data.street_2,
         vendor.contact.apt = data.apt,
         vendor.contact.city = data.city,
         vendor.contact.state = data.state,    //selected from dropdown, will be 2 letters
         vendor.contact.zip = data.zip,
         vendor.notes = data.notes
         vendor.save((err) => {
            if(err) throw err
            else {
               console.log('updated vendor');
               response.status(200).json(vendor)
            }
         });
      }
   });
}

let fetchOne = function(request,response){
   let vendorId = request.params.vendorId
   Vendor.findById(vendorId, (err, vendor) => {
      if (err) throw err;
      if (!vendor) {
         response.status(401).send('There is no vendor associated with that id.')
      } else {
         response.status(200).json(vendor)
      }
   });
}
let getAll = function(request,response){
   let account = request.params.id
   let vendorList = Vendor.find({account_id: account}).sort({fullName: 1});
   vendorList.exec((err, vendors) => {
      if (err) throw err
      response.json(vendors);
   })
}
let querySort = function(request,response){
   let account = request.params.id,
       vendorList;
       debugger
   switch (request.params.sortTerm) {
      case 'type':
         vendorList = Vendor.find({account_id: account}).sort({businessType: 1});
         break;
      case 'price':
         vendorList = Vendor.find({account_id: account}).sort({price: 1});
         break;
      default:
         break;
   }
   debugger
   vendorList.exec((err, vendors) => {
      if (err) throw err
      debugger
      response.json(vendors);
   })
}
let doneSearch = function(request,response){
   let account = request.params.id;

   let vendorList = Vendor.find({
          account_id: account,
          paid: true
       }).sort({datePaid: 1});

   vendorList.exec((err, vendors) => {
      if (err) throw err
      debugger
      response.json(vendors);
   })
}
let destroy = function(request,response){
   var vendorId = request.body.vendorId;
   Vendor.remove({_id: vendorId}, function(err) {
      if (err) response.json({message: err + '. Could not delete vendor'});
      else response.json({message: 'vendor deleted'})
   });
}



module.exports = {
   // privatize all:
   create: newVendor,
   update: updateVendor,
   fetch: fetchOne,
   vendorList: getAll,
   querySort: querySort,
   doneSearch: doneSearch,
   destroy: destroy
}
