'use strict'
$(function(){

   // function allowAccess(ajaxHeader) {
   //    ajaxHeader.setRequestHeader('x-access-token', localStorage['token']);
   // }
   // $.ajax({
   //    'beforeSend': allowAccess,
   //    url: '/guests/add',
   //    method: 'GET'
   // });

   let doc = document,
       loginLinks  = $('ul.login-signup'),
       accountForm = $('div.new-account-form'),
       loginForm   = $('div.login-form'),
       myAccount;

   loginLinks.children().eq(0).click( ()=>{
      loginForm.detach()
      $('.forms').append(accountForm)
   })

   loginLinks.children().eq(1).click( ()=>{
      accountForm.detach()
      $('.forms').append(loginForm)
   })

   $('button.new-account').click(function() {
      let emails = '';
      emails += accountForm.children('input').eq(0).val();
      emails += ',' + accountForm.children('div').eq(0).children('input').eq(0).val();
      emails += ',' + accountForm.children('input').eq(1).val();
      debugger
      let password = accountForm.children('div').eq(1).children('input').eq(0).val();
      let greeting = accountForm.children('div').eq(2).children('input').eq(0).val();
      let newAccountData = {
         emails: emails,
         password: password,
         greeting: greeting
      }
      debugger
      $.ajax({
         // hit account create
         url: "/account/new",
         method: "POST",
         data: newAccountData
      }).done(logEmIn(newAccountData)); // log em in
   });
   $('button.login').click(function() {
      let email = loginForm.children('input').eq(0).val();
      let password = loginForm.children('input').eq(1).val();

      let loginData = {
         email: email,
         password: password
      }
      logEmIn(loginData); // log em in
   });

   let logEmIn = function(data){
      debugger
      if (data.email) {

      } else if (data.emails.indexOf(',' != -1)) {
         data['email'] = data.emails.split(',')[0]
         debugger
      }
      $.ajax({
         // log em in
         url: "/account/authenticate",
         method: "POST",
         data: data
      }).done((json)=> {
         // localStorage is kind of everything
         console.log('index line 69; ajax done:',json);
         myAccount = json.account['_id'];
         console.log('index line 71; json.account_id',myAccount);
         console.log('index line 72;json token:',json.token);
         localStorage.setItem('token',json.token); // error here
         console.log('index line 74; token: ' + localStorage['token']);
         // show the next step
         showActions(data)
         debugger
      })
   }

   let logEmOut = function(){
      debugger
      if (localStorage.token) {

      }
      goHome()
   }

   let goHome = function(){
      console.log('clear all the things and gtf home!');
   }

   let showActions = function(info){
      console.log('show the add guests screen');
   }

   accountForm.detach();
   loginForm.detach();
   $('.forms').empty();
})
