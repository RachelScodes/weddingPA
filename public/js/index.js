'use strict'
$(function(){

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   let doc = document,
       signinLinks  = $('ul.signin-signup'),
       accountForm = $('div.new-account-form'),
       signinForm   = $('div.signin-form');

   signinLinks.children('#signup').click( ()=>{
      event.stopPropagation()
      signinForm.detach()
      $('.forms').append(accountForm)
   })

   signinLinks.children('#signin').click( ()=>{
      event.stopPropagation()
      accountForm.detach()
      $('.forms').append(signinForm)
   })

   signinLinks.children('#about').click( ()=>{
      event.stopPropagation()
      if ($('div.information').length > 0) {
         $('div.information').remove()
      } else {
         let aboutDiv = $('<div>')
         aboutDiv.attr('class','information');
         aboutDiv.html(
            '<h1>Weddings are wonderful. Planning them sucks</h1><p>Ever wanted to ask someone to \"Plan this wedding for me?\"<br> That\'s where we come in.</p><button class=\'hide-info\'>Close Window</button>'
         )
         aboutDiv.appendTo('.container')
         aboutDiv.children('button').eq(0).click( ()=>{
            event.stopPropagation()
            aboutDiv.remove()
         })
      }
   })

   $('button.new-account').click(function() {
      event.stopPropagation()
      let newAccountData = accountFormCompile();
      $.ajax({
         // hit account create
         url: "/account/signup",
         method: "POST",
         data: newAccountData
      }).done((successful) => {
         logEmIn(newAccountData)
      }); // log em in
   });
   $('button.signin').click(function() {
      event.stopPropagation()
      logEmIn({
         email: signinForm.children('input').eq(0).val(),
         password: signinForm.children('input').eq(1).val()
      }); // log em in
   });

   let logEmIn = function(data){
      if (!data.email && data.emails.indexOf(',' != -1)) {
         data['email'] = data.emails.split(',')[0]
      }
      $.ajax({
         // log em in
         url: "/account/login",
         method: "POST",
         data: data
      }).done((signinData)=> {
         showActions(signinData)
      })
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
      accountForm.children('input').eq(0).val(emails[0]);
      accountForm.children('div').eq(0).children('input').eq(0).val(emails[1]);
      accountForm.children('input').eq(1).val(emails[2]);
      accountForm.children('div').eq(2).children('input').eq(0).val(json.greeting);
      accountForm.children('button').remove();
      accountForm.append($('<div class="actions">'))
      drawSaveButt()
      drawDeleteButt()
      console.log(json);
   }

   let drawSaveButt = function(){
      let saveButt = $('<button>');
      saveButt.text('Save').attr('id','save-account')
      saveButt.click( ()=> {
         event.stopPropagation()
         let updateData = accountFormCompile()
         updateData['id'] = localStorage.myAccount
         $.ajax({
            'beforeSend': verifyToken,
            url: "/account",
            method: "PUT",
            data: updateData
         }).done((accountInfo)=> {
            console.log(accountInfo);
            logEmIn(updateData);
         })
      })
      saveButt.appendTo($(accountForm).children('div.actions'))
   }

   let accountFormCompile = function(){
      let emails = '';
      emails += accountForm.children('input').eq(0).val();
      emails += ',' + accountForm.children('div').eq(0).children('input').eq(0).val();
      emails += ',' + accountForm.children('input').eq(1).val();
      let password = accountForm.children('div').eq(1).children('input').eq(0).val();
      let greeting = accountForm.children('div').eq(2).children('input').eq(0).val();
      let accountData = {
         emails: emails,
         password: password,
         greeting: greeting
      }
      return accountData
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
               console.log(accountInfo);
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
         console.log('logged out');
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

   if (localStorage.myAccount) {
      console.log('you were logged in');
      logEmOut()
   }
   accountForm.detach();
   signinForm.detach();
   $('.forms').empty();
})
