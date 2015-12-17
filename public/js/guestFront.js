'use strict'
$(function(){

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   // identify buttons
   let newGuestButt = $('button.create-guest');
       newGuestButt.click(function() {
          event.stopPropagation()
          let newGuestData = guestFormCompile();
          $.ajax({
             'beforeSend': verifyToken,
             url: "/guest/add",
             method: "POST",
             data: newGuestData
          }).done((successful) => {
             latestGuest(successful);
          }); // log em in
       });

   let svtdSaveButt = $('button#svtd-submit');
       svtdSaveButt.click(function() {
         event.stopPropagation()
         let svtdData = svtdCompile();
         $.ajax({
            // save the date info
            url: "/guest/svtd",
            method: "POST",
            data: svtdData
         }).done((successful) => {
            latestGuest(successful);
         });
       });

   // let rsvpSaveButt = $('button#rsvp');
   //     rsvpSaveButt.click(function() {
   //       event.stopPropagation()
   //       let rsvpData = rsvpCompile();
   //       $.ajax({
   //          // rsvp info
   //          url: "/guest/rsvp",
   //          method: "POST",
   //          data: newGuestData
   //       }).done((successful) => {
   //          showAllGuests();
   //       }); // log em in
   //     });
   // let guestListButt= $('button#rsvp');
   //
   // let showActions = function(data){
   //    if (data.guest._id) {
   //       localStorage.setItem('token',data.token)
   //       localStorage.setItem('myAccount',data.guest._id);
   //
   //       signinLinks.detach();
   //       $('.forms').empty();
   //       if ($('.verify-signout')) {
   //          $('.verify-signout').remove()
   //       }
   //       drawLogout(data.guest)
   //       drawAddGuests()
   //    } else {
   //       console.log('bad token!');
   //       // goHome()
   //    }
   // }

   let latestGuest = function(data){
      localStorage.setItem('latestGuest',data._id)
      getAllGuests();
   }

   let editGuest = function(json){
      // let emails = json.emails.split(',')
      // $('.forms').append(guestForm)
      // guestForm.children('input').eq(0).val(emails[0]);
      // guestForm.children('div').eq(0).children('input').eq(0).val(emails[1]);
      // guestForm.children('input').eq(1).val(emails[2]);
      // guestForm.children('div').eq(2).children('input').eq(0).val(json.greeting);
      // guestForm.children('button').remove();
      // drawSaveButt()
      // drawDeleteButt()
      console.log('edit guest');
   }

   let guestFormCompile = function(){
      let guestData = {
         myAccount: localStorage.myAccount,
         fullName: $('.add-edit-guest').children('input').eq(0).val(),
         email: $('.add-edit-guest').children('input').eq(1).val()
      }
      $('.add-edit-guest').children('input').eq(0).val('')
      $('.add-edit-guest').children('input').eq(1).val('')
      return guestData
   }

   let logEmOut = function(){
      if (localStorage.token) {
         localStorage.token = "";
         localStorage.myAccount = "";
         console.log('logged out');
      }
      goHome()
   }

   let goHome = function(){
      location.reload()
   }

   let getAllGuests = function(){
      $.ajax({
         'beforeSend': verifyToken,
         url: "/guest/all/" + localStorage.myAccount,
         method: "GET"
      }).done((guestList)=> {
         showAllGuests(guestList)
      })
   }

   let showAllGuests = function(data){
      console.log('Showing all guests:');
      let guestDiv = $('#guest-list') ? $('#guest-list') : $('<div id="guest-list">');
          guestDiv.empty()

      for (var i = 0; i < data.length; i++) {
         let content = $('p')
             content.attr('class','guest-ind').text([i]+ ': ' + data[i].fullName);
             let eSpan = $('<span>');
                 eSpan.attr('class','guest-email').text(data[i].email);
         eSpan.appendTo(content);
         content.prependTo(guestDiv);
         drawGuestButtons(content)
      }
      guestDiv.appendTo('#angularize')
   }

   let showEditGuest = function(){
      console.log('show the edit form here');
      // let updateData = guestFormCompile();
      // $.ajax({
      //   // hit guest create
      //   url: "/guest/add",
      //   method: "POST",
      //   data: newGuestData
      // }).done((successful) => {
      //   showAllGuests();
      // }); // log em in
   }
   let drawGuestButtons = function(element) {
      let updateGuestButt = $('<button>')
          updateGuestButt.attr('class','update-guest').text('Update');
          updateGuestButt.click(function() {
             event.stopPropagation()
             showEditGuest()
          });
      let deleteGuestButt = $('<button>')
          deleteGuestButt.attr('class','delete-guest').text('Remove');
          deleteGuestButt.click(function() {
             event.stopPropagation()
             console.log('run delete action');
            //  showEditGuest()
          });
   }

   getAllGuests()

      // let deleteGuestButt = $('<button>').attr('class','destroy-guest');
      //     deleteGuestButt.click( ()=> {
      //        event.stopPropagation()
      //        let dataObj = {
      //           accountId: localStorage.myAccount;
      //        let guestName = $('.add-edit-guest').children('input').eq(0).val(),
      //
      //        $.ajax({
      //           'beforeSend': verifyToken,
      //           url: "/guest",
      //           method: "DELETE",
      //           data: {'accountId': localStorage.myAccount}
      //        }).done((guestInfo)=> {
      //           console.log(guestInfo);
      //           logEmOut();
      //        })
      //    })
      // }

})
