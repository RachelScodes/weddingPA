'use strict'
$(() =>{

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   // define menu items
   $('#menu-view-guests').click( () => {
      $('.guest-svtd').hide()
      $('.add-edit-guest').show()
      $('.guest-rsvp').hide()
      $('div#guest-list').show()
      event.stopPropagation()
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
      showSvtdForm()
   })
   $('#menu-rsvp').click( () => {
      $('.add-edit-guest').hide()
      $('div#guest-list').hide()
      $('.guest-svtd').hide()
      $('.guest-rsvp').show()
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
      localStorage.setItem('latestGuest',data._id)
      getAllGuests();
   }

   let guestFormCompile = () =>{
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
      let guestListDiv = $('<div>')
            .attr('id','guest-list')
            .append(guestListMenu());

      let guests = $('<div>')
            .attr('class','guests-scroll')
            .appendTo(guestListDiv)

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
         .text('Done 💁')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            console.log('mongo query for rsvp and svtd finished true');
         })

      $('<li>')
         .text('No Contact Info')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            console.log('mongo query for svtd finished false');
         })

      $('<li>')
         .text('No RSVP Info')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            console.log('mongo query for rsvp finished false');
         })
      return actions
   }

   let showEditGuest = () =>{
      console.log('show the edit form here');
      let guestData = guestFormCompile();
      $.ajax({
        // hit guest create
        url: "/guest/add",
        method: "POST",
        data: guestData
      }).done((successful) => {
        showAllGuests();
      }); // log em in
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
            guestData['id'] = $(event.toElement).attr('value')
            $.ajax({
               'beforeSend': verifyToken,
               url: "/guest/update",
               method: "PUT",
               data: guestData
            }).done((successful) => {
               latestGuest(successful);
               $('button.create-guest').show()
               $('.add-edit-guest').children('button.update-guest').remove()
            });
         })

      localStorage.setItem('latestGuest',data._id)

   }
   let editGuest = function(json){

      console.log('edit guest');
   }

   let showGuestList = function() {
      if ($('div.add-edit-guest').length == 0) {
         let guestDiv = $('<div>').attr('class','add-edit-guest')
             guestDiv.html('<label>Full name of Guest:</label><input type=\"text\" placeholder=\"Mr. E. Mann\"></input><label>Guest email address:</label><input type=\"email\" placeholder=\"mysteryman@gmail.com\"></input>')

         let buttAdd = $('<button>').appendTo(guestDiv)
            .attr('class','create-guest')
            .text('Add')
            .click( ()=> {

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
            .insertBefore(formDiv.children().eq(-2))
            .append('<option selected="true" disabled="disabled">Select State:</option>')
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

         })

      formDiv.appendTo($('#angularize'))
   }

   let showRsvpForm = function(){
      debugger
      // $('.guest-rsvp').hide()

      if ($('div.guest-rsvp')) {
         $('div.guest-rsvp').empty().remove()
      }

      let formDiv = $('<div>').attr('class','guest-rsvp')
      $('<h2>')
         .attr('class','rsvp-greet')
         .text('You\'re invited to ' + $('#who').text() + '\'s wedding!')
         .appendTo(formDiv);

      $('<p>')
         .text('Please enter your rsvp information below:')
         .appendTo(formDiv);

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

      $('<div>')
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

      formDiv.append('<label>Anything else we should know?</label>')


      $('<textarea>').appendTo(formDiv)
         .attr('name','notes')
         .attr('placeholder','Remember, you can always edit this form later');

      addBreak(formDiv)
      $('<button>')
         .appendTo(formDiv)
         .attr('id','rsvp-submit')
         .text('Save Your Response')
         .click( (e)=> {
            debugger
            console.log('clicked',e);
            console.log(this);

         })

      formDiv.appendTo($('#angularize'))

   }

   // let inputFactory = function(elementType,object,attrArray){}

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
