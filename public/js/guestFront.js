'use strict'
$(() =>{

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   // define menu items
   $('#menu-view-guests').click( () => {
      event.stopPropagation()
      console.log('show guest add edit view');
      showGuestList()
   })
   $('#menu-svtd').click( () => {
      event.stopPropagation()
      console.log('show save the date form');
      showSvtdForm()
   })
   $('#menu-rsvp').click( () => {
      event.stopPropagation()
      console.log('show rsvp form');
      showRsvpForm()
   })

   // future features
   // $('menu-view-vendors').click( () => {
   //    event.stopPropagation()
   //    showEditGuest()
   //    console.log('');
   // })
   // $('menu-send-emails').click( () => {
   //    event.stopPropagation()
   //    showEditGuest()
   //    console.log('');
   // })
   // $('menu-export-guests').click( () => {
   //    event.stopPropagation()
   //    showEditGuest()
   //    console.log('');
   // })
   // $('menu-export-vendors').click( () => {
   //    event.stopPropagation()
   //    showEditGuest()
   //    console.log('');
   // })

   // identify buttons


   let svtdSaveButt = $('button#svtd-submit');
       svtdSaveButt.click(() => {
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
   //     rsvpSaveButt.click(() => {
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
      debugger
      localStorage.setItem('latestGuest',data._id)
      getAllGuests();
   }

   let editGuest = function(json){
      debugger
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

   let guestFormCompile = () =>{
      debugger
      let guestData = {
         myAccount: localStorage.myAccount,
         fullName: $('.add-edit-guest').children('input').eq(0).val(),
         email: $('.add-edit-guest').children('input').eq(1).val()
      }
      $('.add-edit-guest').children('input').eq(0).val('')
      $('.add-edit-guest').children('input').eq(1).val('')
      return guestData
   }

   let getAllGuests = () =>{
      if ($('#guest-list')) {
         $('#guest-list').remove()
      }
      debugger
      $.ajax({
         'beforeSend': verifyToken,
         url: "/guest/all/" + localStorage.myAccount,
         method: "GET"
      }).done((guestList)=> {
         showAllGuests(guestList)
      })
   }

   let showAllGuests = function(data){
      debugger
      console.log('Showing all guests:');
      let guestListDiv = $('<div>')
            .attr('id','guest-list');

      for (var i = 0; i < data.length ; i++) {
         let contentPar = $('<p>')
               .attr('class','guest-ind')
               .text([i]+ ': ' + data[i].fullName)

         let eSpan = $('<span>')
               .attr('class','guest-email')
               .text(data[i].email)
               .appendTo(contentPar);

         drawGuestButtons(contentPar)
         contentPar.prependTo(guestListDiv);
      }
      guestListDiv.appendTo('#angularize')
   }

   let showEditGuest = () =>{
      console.log('show the edit form here');
      debugger
      let updateData = guestFormCompile();
      $.ajax({
        // hit guest create
        url: "/guest/add",
        method: "POST",
        data: newGuestData
      }).done((successful) => {
        showAllGuests();
      }); // log em in
   }
   let drawGuestButtons = function(element) {
      let updateGuestButt = $('<button>')
          .attr('class','update-guest')
          .text('Update')
          .appendTo(element)
          .click(() => {
             event.stopPropagation()
             showEditGuest()
          });
      let deleteGuestButt = $('<button>')
          .attr('class','delete-guest')
          .text('Remove')
          .appendTo(element)
          .click(() => {
             event.stopPropagation()
             console.log('run delete action');
            //  showEditGuest()
          });
   }

   let showGuestList = function() {
      debugger
      if ($('div.add-edit-guest').length == 0) {
         let guestDiv = $('<div>').attr('class','add-edit-guest')
             guestDiv.html('<label>Full name of Guest:</label><input type=\"text\" placeholder=\"Mr. E. Mann\"></input><label>Guest email address:</label><input type=\"email\" placeholder=\"mysteryman@gmail.com\"></input>')

         let buttAdd = $('<button>')
            .attr('class','create-guest')
            .text('Add')
            .click( ()=> {
               debugger
               event.stopPropagation()
               let newGuestData = guestFormCompile();
               $.ajax({
                  'beforeSend': verifyToken,
                  url: "/guest/add",
                  method: "POST",
                  data: newGuestData
               }).done((successful) => {
                  latestGuest(successful);
               });
            })
            .appendTo(guestDiv)

         let buttUpdate = $('<button>')
            .attr('class','update-guest')
            .text('Update')
            .click( ()=> {
               event.stopPropagation()
               console.log('clicked update guest');
            })
            .appendTo(guestDiv)

         let buttRemove = $('<button>')
            .attr('class','destroy-guest')
            .text('Remove')
            .click( ()=> {
               event.stopPropagation()
               console.log('clicked remove guest');
            })
            .appendTo(guestDiv)
         guestDiv.appendTo($('#angularize'))
      }
      getAllGuests()
   }

   let showSvtdForm = function() {
      function addBreak(element){
         element.append('<br>')
      }

      if ($('div.guest-svtd')) {
         $('div.guest-svtd').empty().remove()
      }

      let formDiv = $('<div>').attr('class','guest-svtd')
      $('<h2>')
         .attr('class','rsvp-greet')
         .text('You\'re invited to ' + $('#who').text() + '\'s wedding!')
         .appendTo(formDiv);
      $('<p>')
         .text('Enter your mailing address:')
         .appendTo(formDiv);

      let textFields = ["Name as it should Appear","Street Line One","Street Line Two","Apt/Ste","City","Zipcode"]

      for (var i = 0; i<textFields.length; i++) {
         let inputField = $('<input>')
            .attr('type','text')
            .attr('placeholder',textFields[i])
            .appendTo(formDiv);
         addBreak(formDiv)
      }

      let stateDropDown = $('<select>')
            .insertBefore(formDiv.children().eq(-2))
            .append('<option selected="true" disabled="disabled">Select State:</option>');

      let stateVals = {
            "AL": 'Alabama',
         	"AK": 'Alaska',
         	"AZ": 'Arizona',
         	"AR": 'Arkansas',
         	"CA": 'California',
         	"CO": 'Colorado',
         	"CT": 'Connecticut',
         	"DE": 'Delaware',
         	"DC": 'District Of Columbia',
         	"FL": 'Florida',
         	"GA": 'Georgia',
         	"HI": 'Hawaii',
         	"ID": 'Idaho',
         	"IL": 'Illinois',
         	"IN": 'Indiana',
         	"IA": 'Iowa',
         	"KS": 'Kansas',
         	"KY": 'Kentucky',
         	"LA": 'Louisiana',
         	"ME": 'Maine',
         	"MD": 'Maryland',
         	"MA": 'Massachusetts',
         	"MI": 'Michigan',
         	"MN": 'Minnesota',
         	"MS": 'Mississippi',
         	"MO": 'Missouri',
         	"MT": 'Montana',
         	"NE": 'Nebraska',
         	"NV": 'Nevada',
         	"NH": 'New Hampshire',
         	"NJ": 'New Jersey',
         	"NM": 'New Mexico',
         	"NY": 'New York',
         	"NC": 'North Carolina',
         	"ND": 'North Dakota',
         	"OH": 'Ohio',
         	"OK": 'Oklahoma',
         	"OR": 'Oregon',
         	"PA": 'Pennsylvania',
         	"RI": 'Rhode Island',
         	"SC": 'South Carolina',
         	"SD": 'South Dakota',
         	"TN": 'Tennessee',
         	"TX": 'Texas',
         	"UT": 'Utah',
         	"VT": 'Vermont',
         	"VA": 'Virginia',
         	"WA": 'Washington',
         	"WV": 'West Virginia',
         	"WI": 'Wisconsin',
         	"WY": 'Wyoming',
            "AS": 'American Samoa',
            "GU": 'Guam',
            "MP": 'Northern Mariana Islands',
            "PR": 'Puerto Rico',
            "UM": 'United States Minor Outlying Islands',
            "VI": 'Virgin Islands',
      }

      for (var i in stateVals) {
         let optionTag = $('<option>')
            .attr('value',i)
            .text(stateVals[i]);
         optionTag.appendTo(stateDropDown);
      };

      addBreak(formDiv)
      $('<input>').appendTo(formDiv)
         .attr('type','tel')
         .attr('placeholder','Phone Number')

      addBreak(formDiv);
      $('<textarea>').appendTo(formDiv)
         .attr('name','notes')
         .attr('placeholder','If you have a non-standard address, please enter here');

      addBreak(formDiv)
      $('<button>')
         .appendTo(formDiv)
         .attr('id','svtd-submit')
         .text('Save Your Response')
         .click( (e)=> {
            console.log('clicked',e);
            console.log(this);
            debugger
         })

      formDiv.appendTo($('#angularize'))
   }


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

   let logEmOut = () =>{
      if (localStorage.token) {
         localStorage.token = "";
         localStorage.myAccount = "";
         console.log('logged out');
      }
      goHome()
   }

   let goHome = () =>{
      location.reload()
   }

})
