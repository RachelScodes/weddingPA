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
       signinForm   = $('div.signin-form'),
       myAccount;

   signinLinks.children().eq(0).click( ()=>{
      signinForm.detach()
      $('.forms').append(accountForm)
   })

   signinLinks.children().eq(1).click( ()=>{
      accountForm.detach()
      $('.forms').append(signinForm)
   })

   $('button.new-account').click(function() {
      let emails = '';
      emails += accountForm.children('input').eq(0).val();
      emails += ',' + accountForm.children('div').eq(0).children('input').eq(0).val();
      emails += ',' + accountForm.children('input').eq(1).val();
      let password = accountForm.children('div').eq(1).children('input').eq(0).val();
      let greeting = accountForm.children('div').eq(2).children('input').eq(0).val();
      let newAccountData = {
         emails: emails,
         password: password,
         greeting: greeting
      }
      $.ajax({
         // hit account create
         url: "/account/new",
         method: "POST",
         data: newAccountData
      }).done(logEmIn(newAccountData)); // log em in
   });
   $('button.signin').click(function() {
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
         url: "/account/authenticate",
         method: "POST",
         data: data
      }).done((signinData)=> {
         showActions(signinData)
      })
   }

   let showActions = function(data){
      //
      myAccount = data.account[0]._id;
      localStorage.setItem('token',data.token);

      signinLinks.detach();
      $('.forms').empty();
      drawLogout(data.account[0])
   }

   let drawLogout = function(data){
      let logoutLinks = $('<ul>')
      logoutLinks.addClass('verify-signout')
      logoutLinks.appendTo('.top-nav');

      // display account greeting
      let loggedInLi = $('<li>')
      loggedInLi.text('Welcome Back ' + data.greeting).attr('id','who') + '!';
      // add link to profile info?
      loggedInLi.appendTo(logoutLinks)

      let logoutButt = $('<li>')
      logoutButt.click(() => {
         logEmOut()
      })
      logoutButt.text('Logout').attr('id','logout')
      logoutButt.appendTo(logoutLinks)
   }

   let logEmOut = function(){
      if (localStorage.token) {
         localStorage.token = "";
         console.log('logged out');
         myAccount = '';
      }
      goHome()
   }

   let goHome = function(){
      location.reload()
   }

   accountForm.detach();
   signinForm.detach();
   $('.forms').empty();
})
