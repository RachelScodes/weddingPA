'use strict'
$(() =>{

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   // define guest-related menu items
   // for logged in user (aka top-navigation bar_)
   $('#menu-view-guests').click( () => {
      event.stopPropagation()
      $('.guest-svtd').hide()
      $('.guest-rsvp').hide()
      $('.add-edit-guest').show()
      $('div#guest-list').show()
      removeVendorInfo()
      localStorage.removeItem('tempName')
      console.log('show guest add edit view');
      showGuestList()
   })
   $('#menu-svtd').click( () => {
      $('.add-edit-guest').hide()
      $('div#guest-list').hide()
      $('.guest-rsvp').hide()
      $('.guest-svtd').show()
      event.stopPropagation()
      console.log('show save the date form');
      removeVendorInfo()
      showSvtdForm()
   })
   $('#menu-rsvp').click( () => {
      $('.add-edit-guest').hide()
      $('div#guest-list').hide()
      $('.guest-svtd').hide()
      $('.guest-rsvp').show()
      event.stopPropagation()
      console.log('show rsvp form');
      removeVendorInfo()
      showRsvpForm()
   })

   // future features
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

   // submit a save-the-date form
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
            showAllGuests(successful);
         });
       });

   let guestFormCompile = () =>{

      let regEmail = /.+@.+\..+/i,
          email = $('.add-edit-guest').children('input').eq(1).val(),
          fullName = $('.add-edit-guest').children('input').eq(0).val(),
          guestData = {
             alerts: []
          };

      if (fullName == '') {
         guestData['alerts'].push('Name can\'t be blank')
      }
      if (email == '') {
         guestData['alerts'].push('Email can\'t be blank')
      } else if (!regEmail.test(email)) {
         guestData['alerts'].push('Invalid email')
      }

      if (guestData.alerts.length > 0) {
         alert('\n'+guestData.alerts.join('\n\n'))
         return false
      } else {
         let guestData = {
            myAccount: localStorage.myAccount,
            fullName: fullName,
            email: email
         }
         $('.add-edit-guest').children('input').eq(0).val('')
         $('.add-edit-guest').children('input').eq(1).val('')
         return guestData
      }
   }

   let getAllGuests = () =>{
      $.ajax({
         'beforeSend': verifyToken,
         url: "/guest/all/" + localStorage.myAccount,
         method: "GET"
      }).done((guestList)=> {
         showAllGuests(guestList)
      })
   }

   let showAllGuests = (data) => {
      debugger
      console.log('Showing all guests:');
      let guestListDiv,
          guests;

      if ($('#guest-list').length == 0){
         guestListDiv = $('<div>')
            .attr('id','guest-list')
            .append(guestListMenu());
      } else {
         guestListDiv = $('#guest-list')
      }
      if ($('.guests-scroll').length == 0) {
         guests = $('<div>')
            .attr('class','guests-scroll')
            .appendTo(guestListDiv)
      } else if ($('.guests-scroll')) {
         guests = $('.guests-scroll')
         guests.empty()
      }

      for (var i = 0; i < data.length ; i++) {
         let contentPar = $('<div>')
               .attr('class','guest-ind')
               .append($('<p>').text(data[i].fullName))

         let eSpan = $('<span>')
               .attr('class','guest-email')
               .text(data[i].email)
               .appendTo(contentPar);

         drawGuestButtons(contentPar,data[i]._id)
         contentPar.appendTo(guests);
      }
      guestListDiv.appendTo('#angularize')
   }

   let guestListMenu = function(){
      let actions = $('<div>')
         .attr('class','guest-list-menu')
         .append('<h2>Guest List:</h2>')
         .append($('<ul>'))

      $('<li>')
         .text('All Guests')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#guest-scroll')) {
               $('#guest-scroll').remove()
            }
            $('#menu-view-guests').click()
         })

      $('<li>')
         .text('Done 💁')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#guest-scroll')) {
               $('#guest-scroll').remove()
            }
            $.ajax({
               'beforeSend': verifyToken,
               url: "/guest/done/" + localStorage.myAccount,
               method: "GET"
            }).done((guestList)=> {
               console.log('DONE mongo query for svtd finished false');
               showAllGuests(guestList)
            })
         })

      $('<li>')
         .text('No Contact Info')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#guest-scroll')) {
               $('#guest-scroll').remove()
            }
            $.ajax({
               'beforeSend': verifyToken,
               url: "/guest/query/svtd/" + localStorage.myAccount,
               method: "GET"
            }).done((guestList)=> {
               console.log('DONE mongo query for rsvp and svtd finished true');
               showAllGuests(guestList)
            })
         })

      $('<li>')
         .text('No RSVP Info')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#guest-scroll')) {
               $('#guest-scroll').remove()
            }
            $.ajax({
               'beforeSend': verifyToken,
               url: "/guest/query/rsvp/" + localStorage.myAccount,
               method: "GET"
            }).done((guestList)=> {
               console.log('DONE mongo query for rsvp finished false');
               showAllGuests(guestList)
            })
         })
      return actions
   }

   let showEditGuest = () =>{
      console.log('show the edit form here');
      let guestData = guestFormCompile();
      if (guestData){
         $.ajax({
           // hit guest create
           url: "/guest/add",
           method: "POST",
           data: guestData
         }).done((successful) => {
           showAllGuests(successful);
         }); // log em in
      }
   }

   let drawGuestButtons = function(element,id) {
      let container = $('<div>').attr('class','guest-list-buttons')
      let updateGuestButt = $('<button>')
          .attr('class','update-guest')
          .text('Update')
          .attr('value',id)
          .appendTo(container)
          .click(() => {
             event.stopPropagation()
             let id = $(event.toElement).attr('value')
             fetchGuest(id)
          });

      let emailButt = $('<button>')
            .attr('class','email-guest')
            .text('Email')
            .attr('value',id)
            .appendTo(container)
            .click(() => {
               alert('send email down temporarily. try again later.')
               // event.stopPropagation()
               // let guestName = $(event.toElement).eq(0).parent().siblings().eq(0).text()
               // let id = $(event.toElement).attr('value')
               // localStorage.setItem('myGuest',id)
               // localStorage.setItem('tempName',guestName)
               // $('#menu-svtd').click()
           });

      let deleteGuestButt = $('<button>')
          .attr('class','delete-guest')
          .text('Remove')
          .attr('value',id)
          .appendTo(container)
          .click((event) => {

             event.stopPropagation()
             console.log('run delete action');
             let dataObj = {
                guestId: $(event.toElement).attr('value')
             }

             $.ajax({
                'beforeSend': verifyToken,
                url: "/guest",
                method: "DELETE",
                data: dataObj
             }).done((message)=> {
                console.log(message);
                showGuestList()
             })
          });

      container.appendTo(element)
   }
   let fetchGuest = function(guestId){
      $.ajax({
         'beforeSend': verifyToken,
         url: "/guest/fetch/" + guestId,
         method: "GET"
      }).done((guestObj)=> {
         if ($('.add-edit-guest').children('button.update-guest')) {
            $('.add-edit-guest').children('button.update-guest').remove()
         }
         renderEdit(guestObj,guestId)
      })
   }
   let renderEdit = function(data,id){
      $('button.create-guest').hide()
      $('.add-edit-guest').children('input').eq(0).val(data.fullName)
      $('.add-edit-guest').children('input').eq(1).val(data.email)

      if ($('.add-edit-guest').children('button.updateGuest')) {
         $('.add-edit-guest').children('button.updateGuest').remove()
      }
      let buttUpdate = $('<button>').appendTo('.add-edit-guest')
         .attr('class','update-guest')
         .attr('value',id)
         .text('Update')
         .click( ()=> {

            event.stopPropagation()
            let guestData = guestFormCompile();
            if (guestData) {
               guestData['id'] = $(event.toElement).attr('value')
               $.ajax({
                  'beforeSend': verifyToken,
                  url: "/guest/update",
                  method: "PUT",
                  data: guestData
               }).done((successful) => {
                  $('button.create-guest').show()
                  $('.add-edit-guest').children('button.update-guest').remove()
                  showGuestList()
               });
            }
         })
      showGuestList()
   }
   let editGuest = function(json){
      debugger
      console.log('edit guest');
   }

   let showGuestList = function() {
      if ($('.guest-svtd')) {
         $('.guest-svtd').remove()
      }
      if ($('div.add-edit-guest').length == 0) {
         let guestDiv = $('<div>').attr('class','add-edit-guest')
             guestDiv.html('<label>Full name of Guest:</label><input type=\"text\" placeholder=\"Mr. E. Mann\"></input><label>Guest email address:</label><input type=\"email\" placeholder=\"mysteryman@gmail.com\"></input>')

         let buttAdd = $('<button>').appendTo(guestDiv)
            .attr('class','create-guest')
            .text('Add')
            .click( ()=> {

               event.stopPropagation()
               let newGuestData = guestFormCompile();
               if (newGuestData) {
                  $.ajax({
                     'beforeSend': verifyToken,
                     url: "/guest/add",
                     method: "POST",
                     data: newGuestData
                  }).done((successful) => {
                     showAllGuests();
                  });
               }
            })

         guestDiv.appendTo($('#angularize'))
      }
      getAllGuests()
   }

   function addBreak(element){
      element.append('<br>')
   }

   let showSvtdForm = function() {
      if ($('div.guest-svtd')) {
         $('div.guest-svtd').empty().remove()
      }
      let formDiv = $('<div>').attr('class','guest-svtd')
      $('<h2>')
         .attr('class','svtd-greet')
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
            .append('<option selected="true" disabled="disabled">Select State:</option>')
            .insertBefore(formDiv.children().eq(-2))
            .next().css('width','100px');

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
            .text(stateVals[i])
            .appendTo(stateDropDown);
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
      let submitButt = $('<button>')
         .appendTo(formDiv)
         .attr('id','svtd-submit')
         .text('Save Your Response')
         .click( (e)=> {
            event.stopPropagation()
            saveTheDate()
         })

      if (localStorage.tempName) {
         formDiv.children('input').eq(0).val(localStorage.tempName)
         submitButt.attr('value',localStorage.myGuest)
      } else if (localStorage.myGuest) {
         localStorage.removeItem('myGuest')
      }

      formDiv.appendTo($('#angularize'))
   }

   let saveTheDate = function(){
      if (localStorage.myGuest) {
         let guestUpdate = {
            'fullName': $('.guest-svtd').children('input').eq(0).val() ,
            'id': localStorage.myGuest ,
            'street_1': $('.guest-svtd').children('input').eq(1).val() ,
            'street_2': $('.guest-svtd').children('input').eq(2).val() ,
            'apt': $('.guest-svtd').children('input').eq(3).val() ,
            'city': $('.guest-svtd').children('input').eq(4).val() ,
            'state': $('.guest-svtd').children('select').eq(0).val() ,
            'zip': $('.guest-svtd').children('input').eq(5).val() ,
            'phone': $('.guest-svtd').children('input').eq(6).val() ,
            'notes': $('.guest-svtd').children('textarea').eq(0).val()
         }
         $.ajax({
            url: "/guest/svtd",
            method: "PUT",
            data: guestUpdate
         }).done((successful) => {
            localStorage.removeItem(myGuest);
            localStorage.removeItem(tempName);
            showAllGuests(successful);
         });
      } else {
         alert('this is just an example')
      }

   }

   // draw the sample RSVP form
   let showRsvpForm = function(){
      // $('.guest-rsvp').hide()

      // erase old div
      $('div.guest-rsvp').remove()

      // draw new containing div
      let formDiv = $('<div>').attr('class','guest-rsvp')

      // add introduction
      $('<h2>').text('You\'re invited to ' + $('#who').text() + '\'s wedding!')
         .attr('class','rsvp-greet')
         .appendTo(formDiv);
      $('<p>').text('Please enter your rsvp information below:')
         .appendTo(formDiv);

      // attending radio buttons
      let rsvpRadio = {
         'Gladly Attending': 'true',
         'Regretfully Declining': 'false',
         'Resentfully Attending': 'true',
         'Enthusiastically Decline': 'false',
         'Enthusiastically Responding but won\'t show up': 'false',
         'Will not respond but am attending anyway': 'true',
         'I go where the free food is': 'true'
      }
      let attending = $('<div>').attr('class','attending-radios')
         .append('<label>Will you be attending?</label>')
         .appendTo(formDiv)
      for (var i in rsvpRadio) {
         addBreak(attending)
         let radioButton = '<input type="radio" name="attending" value="'+rsvpRadio[i]+'">'+i
         attending.append(radioButton)
      }

      // view/correct name
      $('<div>').attr('class','fullName')
         .append('<label>Verify/correct your name:</label>')
         .append(
            $('<input>')
               .attr('type','text')
               .attr('placeholder','Name as it should Appear'))
         .appendTo(formDiv)

      let entreeChoices = {
         "Chicken": 'entree',
         "Fish": 'entree',
         "Meat": 'entree',
         "Air": 'entree'
      }

      $('<div>').attr('class','entree-one')
         .append('<label>Choose an entree:</label>')
         .appendTo(formDiv)

      for (var i in entreeChoices) {
         let radioButton = '<input type="radio" name="entree" value="'+i+'">'+i
         formDiv.children('.entree-one').append(radioButton)
      }

      $('<div>').attr('class','diet-one')
         .append('<label>Dietary restrictions:</label>')
         .append('<input type="text" placeholder="Kosher/Allergic to vegans"></input>')
         .appendTo(formDiv)

      let plusDate = $('<select>')
            .append('<option selected="true" disabled="disabled">Plus One?</option>')
            .appendTo(formDiv);

      let dateVals = {
            "true": 'Yes',
         	"false": 'No'
         }

      for (var i in dateVals) {
         let optionTag = $('<option>')
            .attr('value',i)
            .text(dateVals[i]);
         optionTag.appendTo(plusDate);
      };


      $('<div>').attr('class','entree-two')
         .append('<label>Your guest\'s entree:</label>')
         .appendTo(formDiv)

      for (var i in entreeChoices) {
         let radioButton = '<input type="radio" name="entreep" value="'+i+'">'+i
         formDiv.children('.entree-two').append(radioButton)
      }

      $('<div>').attr('class','diet-two')
         .append('<label>Your guest\'s Dietary restrictions:</label>')
         .append('<input type="text" placeholder="Kosher/Allergic to vegans"></input>')
         .appendTo(formDiv)

      $('<div>')
         .append('<label>What song is totes obvi?</label>')
         .append(
            $('<input>').attr('type','text')
               .attr('placeholder','Song Title - Artist(You Probably haven\'t heard of)'))
         .appendTo(formDiv)

      formDiv.append('<label id="last">Anything else we should know?</label>')


      $('<textarea>').appendTo(formDiv)
         .attr('name','notes')
         .attr('placeholder','Remember, you can always edit this form later');

      addBreak(formDiv)
      let submitButt = $('<button>')
         .appendTo(formDiv)
         .attr('id','rsvp-submit')
         .text('Save Your Response')
         .click( ()=> {
            event.stopPropagation()
            // saveRsvpResponse()
            alert('this is just an example')

         })

      if (localStorage.tempName) {
         $('.guest-rsvp').children().eq(3).children('input').val(localStorage.tempName)
         submitButt.attr('value',localStorage.myGuest)
      } else if (localStorage.myGuest) {
         localStorage.removeItem('myGuest')
      }

      formDiv.appendTo($('#angularize'))

   }

   // what happens when we click
   // submit on the SVTD form screen
   let saveRsvpResponse = function(){
      // if referred from guestlist, submit info
      if (localStorage.myGuest) {
         let plusOne = function(){
            return ($('.guest-rsvp').children('select').eq(0).val == "true") ? true : false;
         }
         let guestUpdate = {
            'id': localStorage.myGuest ,
            'fullName': $('.guest-rsvp').children().eq(3).children('input').val() ,
            'attending': $('input[name=attending]:checked').val() ,
            'entree': $('input[name=entree]:checked').val() ,
            'diet': $('.guest-rsvp').children().eq(5).children('input').val() ,
            'plus': plusOne(),
            'entreep': $('input[name=entreep]:checked').val() ,
            'dietp': $('.guest-rsvp').children().eq(8).children('input').eq(0).val() ,
            'song': $('.guest-rsvp').children().eq(9).children('input').eq(0).val() ,
            'message': $('.guest-rsvp').children('textarea').eq(0).val()
         }
         $.ajax({
            // save the date info
            url: "/guest/rsvp",
            method: "PUT",
            data: guestUpdate
         }).done((successful) => {
            localStorage.removeItem(myGuest);
            localStorage.removeItem(tempName);
            showAllGuests(successful);
         });
      } else { // if referred from example page
         alert('this is just an example')
      }
   }

   // if vendor info was shown, remove it
   let removeVendorInfo = function(){
      if ($('.add-edit-vendor').length != 0) {
         $('.add-edit-vendor').remove()
         $('#vendor-list').remove()
      }
   }

   // clears localStorage
   let logEmOut = () =>{
      if (localStorage.token) {
         localStorage.removeItem('token');
         localStorage.removeItem('myAccount');
      }
      goHome()
   }

   // going home reloads the page and clears cache
   let goHome = () =>{
      location.reload()
   }

})
