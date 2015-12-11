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
       accountForm = $('div.new-account'),
       loginForm   = $('div.login'),
       myAccount;

   loginLinks.children().eq(0).click( ()=>{
      loginForm.detach()
      $('#forms').append(accountForm)
   })

   loginLinks.children().eq(1).click( ()=>{
      accountForm.detach()
      $('#forms').append(loginForm)
   })

   $('button.new-account').click(function() {
      let email1 = accountForm.children('input').eq(0).val();
      let email2 = accountForm.children('input').eq(1).val();
      let email3 = accountForm.children('input').eq(2).val();
      let password = accountForm.children('input').eq(3).val();
      let greeting = accountForm.children('input').eq(4).val();
      let newAccountData = {
         email_1: email1,
         email_2: email2,
         email_3: email3,
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

   let showActions = function(info){
      console.log('show the add guests screen');
   }

   accountForm.detach();
   loginForm.detach();
})
