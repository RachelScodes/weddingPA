'use strict'
$(function(){
   $( document ).tooltip()

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   let doc = document,
       signinLinks  = $('ul.signin-signup'),
       accountForm = $('div.new-account-form'),
       signinForm   = $('div.signin-form');

   // assign click events
   signinLinks.children('#signup').click( ()=>{
      event.stopPropagation()
      let showSignUp = function(){
         signinForm.detach()
         $('.forms').append(accountForm)
         accountForm.hide()
         accountForm.show( "drop", {direction: 'left'}, 1000)
      }
      signinForm.hide( "drop", {direction:'right'}, 500, showSignUp)
   })
   signinLinks.children('#signin').click( ()=>{
      event.stopPropagation()
      let showSignin = function(){
         accountForm.detach()
         $('.forms').append(signinForm)
         signinForm.hide()
         signinForm.show( "drop", {direction: 'left'}, 1000)
      }
      accountForm.hide( "drop", {direction:'right'}, 500, showSignin)
   })
   signinLinks.children('#about').click( ()=>{
      event.stopPropagation()
      drawAboutDiv()
   })

   $('button.new-account').click(function() {
      event.stopPropagation()
      let newAccountData = accountFormCompile();
      if (newAccountData) {
         $.ajax({
            // hit account create
            url: "/account/signup",
            method: "POST",
            data: newAccountData
         }).done((successful) => {
            logEmIn(newAccountData)
         });
      }
   });
   $('button.signin').click(function() {
      event.stopPropagation()
      logEmIn({
         email: signinForm.children('input').eq(0).val(),
         password: signinForm.children('input').eq(1).val()
      }); // log em in
   });


   let logEmIn = function(data){
      debugger
      if (!data.accountId){
         if (!data.email && data.emails.indexOf(',' != -1)) {
            data['email'] = data.emails.split(',')[0]
         }
      }
      // changePageStyle()
      $.ajax({
         // log em in
         url: "/account/login",
         method: "POST",
         data: data
      }).done((signinData)=> {
         showActions(signinData)
      })
   }

   let changePageStyle = function(){
      // $('html').addClass('new-bg')
      // $('top-nav').css({
      //    'color':'rgba(255,255,255,0.7)';
      //    'backgroundColor':'rgba(151, 85, 128, 0.82)';
      // })
      console.log('run css changeover here');
   }

   let showActions = function(data){
      if (data.account._id) {
         localStorage.setItem('token',data.token)
         localStorage.setItem('myAccount',data.account._id);

         signinLinks.detach();
         $('.forms').empty();
         if ($('.verify-signout')) {
            $('.verify-signout').remove()
         }
         drawLogout(data.account)
         drawOptionsMenu()
      } else {
         console.log('bad token!');
         // goHome()
      }
   }

   let drawLogout = function(data){
      // draw new navbar options
      let logoutLinks = $('<ul>')
            .addClass('verify-signout')

      // create account greeting
      let loggedInLi = $('<li>')
            .attr('class','no-hover')
            .text('Hello ');

          $('<span>').attr('id','who')
            .text(data.greeting)
            .appendTo(loggedInLi)
            loggedInLi.append('!');

      let editLi = $('<li>')
            .text('Edit Account')
            .click(() => {
               event.stopPropagation()
               $.ajax({
                  'beforeSend': verifyToken,
                  url: '/account/'+localStorage.myAccount,
                  method: "GET"
               }).done((accountInfo)=> {
                  editAccount(accountInfo)
               })
             })

      // create logout button
      let logoutButt = $('<li>')
          logoutButt.text('Logout').attr('id','logout')
          logoutButt.click(() => {
            event.stopPropagation()
            logEmOut()
          })

      // add everything to nav bar
      logoutLinks.appendTo('.top-nav')
      loggedInLi.appendTo(logoutLinks)
      editLi.appendTo(logoutLinks)
      logoutButt.appendTo($('<span class="right">')).appendTo(logoutLinks)
   }

   let editAccount = function(json){
      let emails = json.emails.split(',')
      $('.forms').append(accountForm)
      accountForm.show( "drop", {direction: 'left'}, 1000)
      $('#angularize').hide()

      accountForm.children('input').eq(0).val(emails[0]);
      accountForm.children('div').eq(0).children('input').eq(0).val(emails[1]);
      accountForm.children('input').eq(1).val(emails[2]);
      accountForm.children('div').eq(2).children('input').eq(0).val(json.greeting);
      accountForm.children('button').remove();
      $('div.actions').empty()

      drawBackButt()
      drawSaveButt()
      drawDeleteButt()
   }

   let drawBackButt = function(){
      let backButt = $('<button>');
      backButt.text('Close').attr('id','back-account')
      backButt.click( ()=> {
         event.stopPropagation()
         $('.forms').empty();
         $('#angularize').show()
      })
      backButt.appendTo($(accountForm).children('div.actions'))
   }

   let drawSaveButt = function(){
      let saveButt = $('<button>');
      saveButt.text('Save').attr('id','save-account')
      saveButt.click( ()=> {
         event.stopPropagation()
         let updateData = accountFormCompile()
         if (updateData) {
            updateData['id'] = localStorage.myAccount
            $.ajax({
               'beforeSend': verifyToken,
               url: "/account",
               method: "PUT",
               data: updateData
            }).done((accountInfo)=> {
               logEmIn(updateData);
            })
         }
      })
      saveButt.appendTo($(accountForm).children('div.actions'))
   }

   let accountFormCompile = function(){
      let regEmail = /.+@.+\..+/i,
          accountData = {
             alerts: []
          };

      let email1 = accountForm.children('input').eq(0).val(),
          email2 = accountForm.children('div').eq(0).children('input').eq(0).val(),
          email3 = accountForm.children('input').eq(1).val(),
          password = accountForm.children('div').eq(1).children('input').eq(0).val();

      // regex checks on email
      if (email1 == '') {
         accountData['alerts'].push("Email 1 is blank")
      } else if (!regEmail.test(email1)) {
         accountData['alerts'].push("Email 1 is not valid")
      }
      if (email2 != '' && !regEmail.test(email2)) {
         accountData['alerts'].push("Email 2 is not valid")
      }
      if (email3 != '' && !regEmail.test(email3)) {
         accountData['alerts'].push("Email 3 is not valid")
      }

      // regex checks on password
      if (password == '') {
         accountData['alerts'].push("Password cannot be blank")
      } else {
         if (!/^(?=.*[a-z])(?=.*[A-Z]).{4,15}$/.test(password)) {
            accountData['alerts'].push("Your password must be between 4 - 15 characters long.")
         }
         if (!/^(?=.*[a-z])(?=.*[A-Z]).{1,100}$/.test(password)) {
            accountData['alerts'].push("Your password must contain at least one capital letter.")
         }
         if (!/^(?=.*\d).{4,15}$/.test(password)) {
            accountData['alerts'].push("Your password must contain at least one number.")
         }
      }


      if (accountData.alerts.length > 0) {
         alert('\n'+accountData.alerts.join('\n\n'))
         return false
      } else {
         let emails = '';
         emails += email1;
         emails += ',' + email2;
         emails += ',' + email3;

         let greeting = accountForm.children('div').eq(2).children('input').eq(0).val();
         let accountData = {
            emails: emails,
            password: password,
            greeting: greeting
         }

         // gather form data
         return accountData
      }
   }

   let drawDeleteButt = function(){
      let deleteButt = $('<button>');
      deleteButt.text('Delete Account').attr('id','delete-account')
      deleteButt.click( ()=> {
         event.stopPropagation()
         let proceed =
            confirm(
               'This will delete your account completely,'+
               '\nIncluding all stored guest information. ' +
               '\n\n IT IS NOT REVERSIBLE! ' +
               '\n\n Click \'OK\' to proceed or \'Cancel\' to go back.')

         if (proceed == true) {
            let accountId = localStorage.myAccount;
            $.ajax({
               'beforeSend': verifyToken,
               url: "/account",
               method: "DELETE",
               data: {'accountId': localStorage.myAccount}
            }).done((accountInfo)=> {
               alert('Account Deleted. :(')
               logEmOut();
            })
         }
      })

      deleteButt.appendTo($(accountForm).children('div.actions'))
   }

   let logEmOut = function(){
      if (localStorage.token) {
         localStorage.token = "";
         localStorage.myAccount = "";
         $('html').removeClass('new-bg')
      }
      goHome()
   }

   let goHome = function(){
      location.reload()
   }

   let drawOptionsMenu = function(){
      //draw new guest form. angularize
      if (localStorage.token) {
         $('#angularize').removeClass('hidden')
      } else {
         logEmOut()
      }
   }

   let drawAboutDiv = function() {
      if ($('div.information').length > 0) {
         $('div.information').remove()
      } else {
         let aboutDiv = $('<div>')
               .attr('class','about')
               .html('<div class="information">')
               .appendTo('.container');
            $('div.information')
               .html('<h1>Weddings are wonderful. <br>Planning them sucks</h1>')
               .append('<p>Ever wanted to ask someone to \"Plan this wedding for me?\"<br> That\'s where we come in.</p>')
               .append(
                  $('<button>')
                     .attr('class','hide-info')
                     .text('Close Window')
                     .click( ()=>{
                        event.stopPropagation()
                        aboutDiv.fadeOut("slow", ()=>{
                           aboutDiv.remove()
                        })
                     })
                  );

         // poster="/images/#"
         let videoEmbed = $('<div>')
             .attr('class','video')
             .html('<video controls name="weddings-suck"><source src="images/weddings-suck.m4v" type="video/mp4"></video')
             .prependTo(aboutDiv);
      }
   }

   accountForm.detach();
   signinForm.detach();
   $('.forms').empty();

   (function(){
      if (localStorage.myAccount) {
         logEmIn({accountId: localStorage.myAccount})
         debugger
      }
   })()
})
