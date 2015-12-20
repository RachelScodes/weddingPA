'use strict'

let helpers = (function(){
   let exportObj = {},
       doc = document,
       signinLinks  = $('ul.signin-signup'),
       accountForm = $('div.new-account-form'),
       signinForm   = $('div.signin-form');

   function verifyToken(xhr) {
      if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   function showSignUp() {
      signinForm.detach()
      $('.forms').append(accountForm)
      accountForm.hide()
      accountForm.show( "drop", {direction: 'left'}, 1000)
   }

   function showSignIn() {
      accountForm.detach()
      $('.forms').append(signinForm)
      signinForm.hide()
      signinForm.show( "drop", {direction: 'left'}, 1000)
   }

   function drawAboutDiv() {
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

   function drawOptionsMenu() {
      //draw new guest form. angularize
      if (localStorage.token) {
         $('#angularize').removeClass('hidden')
      } else {
         logEmOut()
      }
   }

   function logEmOut() {
      if (localStorage.token) {
         localStorage.token = "";
         localStorage.myAccount = "";
         console.log('logged out');
      }
      goHome()
   }

   function drawBackButt() {
      let backButt = $('<button>');
      backButt.text('Close').attr('id','back-account')
      backButt.click( ()=> {
         event.stopPropagation()
         $('.forms').empty();
         $('#angularize').show()
      })
      backButt.appendTo($('div.new-account-form').children('div.actions'))
   }

   function drawSaveButt() {
      let saveButt = $('<button>');
      saveButt.text('Save').attr('id','save-account')
      saveButt.click( ()=> {
         event.stopPropagation()
         let updateData = accountFormCompile()
         if (updateData) {
            updateData['id'] = localStorage.myAccount
            $.ajax({
               'beforeSend': helpers.verifyToken,
               url: "/account",
               method: "PUT",
               data: updateData
            }).done((accountInfo)=> {
               console.log(accountInfo);
               logEmIn(updateData);
            })
         }
      })
      saveButt.appendTo($('div.new-account-form').children('div.actions'))
   }

   function drawDeleteButt() {
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
               'beforeSend': helpers.verifyToken,
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

      deleteButt.appendTo($('div.new-account-form').children('div.actions'))
   }

   function goHome() {
      location.reload()
   }

   function startUp() {
      if (localStorage.myAccount) {
         logEmOut()
      }
      accountForm.detach();
      signinForm.detach();
      $('.forms').empty();
   }

   exportObj['verifyToken'] = verifyToken,
   exportObj['showSignUp'] = showSignUp,
   exportObj['showSignIn'] = showSignIn,
   exportObj['drawAboutDiv'] = drawAboutDiv,
   exportObj['drawOptionsMenu'] = drawOptionsMenu,
   exportObj['drawBackButt'] = drawBackButt,
   exportObj['drawSaveButt'] = drawSaveButt,
   exportObj['drawDeleteButt'] = drawDeleteButt,
   exportObj['logEmOut'] = logEmOut,
   exportObj['goHome'] = goHome,
   exportObj['startUp'] = startUp

   return exportObj
})()
