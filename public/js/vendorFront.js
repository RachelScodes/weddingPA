'use strict'
$(() =>{

   function verifyToken(xhr) {
   	if (localStorage.token) {
         xhr.setRequestHeader('x-access-token', localStorage.token)
      }
   }

   // define menu items
   $('#menu-view-vendors').click( () => {
      alert('feature currently in Beta testing\nEstimated launch: 1.5.2015')
      // debugger
      // event.stopPropagation()
      // removeGuestInfo()
      // showEditVendor()
      // showVendorList()
      // localStorage.removeItem('tempName')
      // console.log('show vendor add edit view');
   })
   // future features
   // $('menu-export-vendors').click( () => {
   //    event.stopPropagation()
   //    showEditVendor()
   //    console.log('');
   // })

   // clear div of guest info
   let removeGuestInfo = function(){
      debugger
      if ($('.add-edit-guest').length != 0) {
         $('.add-edit-guest').remove()
         $('#guest-list').remove()
      } else if ($('.guest-svtd').length != 0){
         $('.guest-svtd').remove();
      } else if ($('.guest-rsvp').length != 0){
         $('.guest-rsvp').remove();
      }
   }

   // identify buttons
   let vendorFormCompile = () =>{
      console.log('get data from vendor form');
      // let regEmail = /.+@.+\..+/i,
      //     email = $('.add-edit-vendor').children('input').eq(1).val(),
      //     fullName = $('.add-edit-vendor').children('input').eq(0).val(),
      //     vendorData = {
      //        alerts: []
      //     };
      //
      // if (fullName == '') {
      //    vendorData['alerts'].push('Name can\'t be blank')
      // }
      // if (email == '') {
      //    vendorData['alerts'].push('Email can\'t be blank')
      // } else if (!regEmail.test(email)) {
      //    vendorData['alerts'].push('Invalid email')
      // }
      //
      // if (vendorData.alerts.length > 0) {
      //    alert('\n'+vendorData.alerts.join('\n\n'))
      //    return false
      // } else {
      //    let vendorData = {
      //       myAccount: localStorage.myAccount,
      //       fullName: fullName,
      //       email: email
      //    }
      //    $('.add-edit-vendor').children('input').eq(0).val('')
      //    $('.add-edit-vendor').children('input').eq(1).val('')
      //    return vendorData
      // }
   }

   let getAllVendors = () =>{
      $.ajax({
         'beforeSend': verifyToken,
         url: "/vendor/all/" + localStorage.myAccount,
         method: "GET"
      }).done((vendorList)=> {
         showAllVendors(vendorList)
      })
   }

   let showAllVendors = (data) => {
      debugger
      console.log('Showing all vendors:');
      let vendorListDiv,
          vendors;

      if ($('#vendor-list').length == 0){
         vendorListDiv = $('<div>')
            .attr('id','vendor-list')
            .append(vendorListMenu());
      } else {
         vendorListDiv = $('#vendor-list')
      }
      if ($('.vendors-scroll').length == 0) {
         vendors = $('<div>')
            .attr('class','vendors-scroll')
            .appendTo(vendorListDiv)
      } else if ($('.vendors-scroll')) {
         vendors = $('.vendors-scroll')
         vendors.empty()
      }

      for (var i = 0; i < data.length ; i++) {
         let contentPar = $('<div>')
               .attr('class','vendor-ind')
               .append($('<p>').text(data[i].businessName))

         let eSpan = $('<span>')
               .attr('class','vendor-type')
               .text(data[i].businessType)
               .appendTo(contentPar);

         drawVendorButtons(contentPar,data[i]._id)
         contentPar.appendTo(vendors);
      }
      vendorListDiv.appendTo('#angularize')
   }

   let vendorListMenu = function(){
      debugger
      console.log('draw vendor menu');
      let actions = $('<div>')
         .attr('class','vendor-list-menu')
         .append('<h2>Vendor List:</h2>')
         .append($('<ul>'))

      $('<li>')
         .text('All Vendors')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#vendor-scroll')) {
               $('#vendor-scroll').remove()
            }
            $('#menu-view-vendors').click()
         })

      $('<li>')
         .text('Done 💁')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#vendor-scroll')) {
               $('#vendor-scroll').remove()
            }
            $.ajax({
               'beforeSend': verifyToken,
               url: "/vendor/done/" + localStorage.myAccount,
               method: "GET"
            }).done((vendorList)=> {
               console.log('DONE mongo query for svtd finished false');
               showAllVendors(vendorList)
            })
         })

      $('<li>')
         .text('Sort by Type')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#vendor-scroll')) {
               $('#vendor-scroll').remove()
            }
            $.ajax({
               'beforeSend': verifyToken,
               url: "/vendor/query/svtd/" + localStorage.myAccount,
               method: "GET"
            }).done((vendorList)=> {
               console.log('DONE mongo query for rsvp and svtd finished true');
               showAllVendors(vendorList)
            })
         })

      $('<li>')
         .text('Sort by Price')
         .appendTo(actions.children('ul'))
         .click( ()=> {
            event.stopPropagation()
            if ($('#vendor-scroll')) {
               $('#vendor-scroll').remove()
            }
            $.ajax({
               'beforeSend': verifyToken,
               url: "/vendor/query/rsvp/" + localStorage.myAccount,
               method: "GET"
            }).done((vendorList)=> {
               console.log('DONE mongo query for rsvp finished false');
               showAllVendors(vendorList)
            })
         })
      return actions
   }

   let showEditVendor = () =>{
      console.log('show the edit form here');
      // let vendorData = vendorFormCompile();
      // if (vendorData){
      //    $.ajax({
      //      // hit vendor create
      //      url: "/vendor/add",
      //      method: "POST",
      //      data: vendorData
      //    }).done((successful) => {
      //      showAllVendors(successful);
      //    }); // log em in
      // }
   }

   let drawVendorButtons = function(element,id) {
      console.log('draw buttons on each venor item');
      let container = $('<div>').attr('class','vendor-list-buttons')
      let updateVendorButt = $('<button>')
          .attr('class','update-vendor')
          .text('Update')
          .attr('value',id)
          .appendTo(container)
          .click(() => {
             event.stopPropagation()
             let id = $(event.toElement).attr('value')
             fetchVendor(id)
          });

      let payButt = $('<button>')
            .attr('class','email-vendor')
            .text('Email')
            .attr('value',id)
            .appendTo(container)
            .click(() => {
               alert('email sent')
               // event.stopPropagation()
               // let vendorName = $(event.toElement).eq(0).parent().siblings().eq(0).text()
               // let id = $(event.toElement).attr('value')
               // localStorage.setItem('myVendor',id)
               // localStorage.setItem('tempName',vendorName)
               // $('#menu-svtd').click()
           });

      let deleteVendorButt = $('<button>')
          .attr('class','delete-vendor')
          .text('Remove')
          .attr('value',id)
          .appendTo(container)
          .click((event) => {

             event.stopPropagation()
             console.log('run delete action');
             let dataObj = {
                vendorId: $(event.toElement).attr('value')
             }

             $.ajax({
                'beforeSend': verifyToken,
                url: "/vendor",
                method: "DELETE",
                data: dataObj
             }).done((message)=> {
                console.log(message);
                showVendorList()
             })
          });

      container.appendTo(element)
   }
   let fetchVendor = function(vendorId){
      $.ajax({
         'beforeSend': verifyToken,
         url: "/vendor/fetch/" + vendorId,
         method: "GET"
      }).done((vendorObj)=> {
         if ($('.add-edit-vendor').children('button.update-vendor')) {
            $('.add-edit-vendor').children('button.update-vendor').remove()
         }
         renderEdit(vendorObj,vendorId)
      })
   }
   let renderEdit = function(data,id){
      $('button.create-vendor').hide()
      $('.add-edit-vendor').children('input').eq(0).val(data.fullName)
      $('.add-edit-vendor').children('input').eq(1).val(data.email)

      if ($('.add-edit-vendor').children('button.updateVendor')) {
         $('.add-edit-vendor').children('button.updateVendor').remove()
      }
      let buttUpdate = $('<button>').appendTo('.add-edit-vendor')
         .attr('class','update-vendor')
         .attr('value',id)
         .text('Update')
         .click( ()=> {

            event.stopPropagation()
            let vendorData = vendorFormCompile();
            if (vendorData) {
               vendorData['id'] = $(event.toElement).attr('value')
               $.ajax({
                  'beforeSend': verifyToken,
                  url: "/vendor/update",
                  method: "PUT",
                  data: vendorData
               }).done((successful) => {
                  $('button.create-vendor').show()
                  $('.add-edit-vendor').children('button.update-vendor').remove()
                  showVendorList()
               });
            }
         })
      showVendorList()
   }
   let editVendor = function(json){
      debugger
      console.log('edit vendor');
   }

   let showVendorList = function() {
      if ($('.vendor-svtd')) {
         $('.vendor-svtd').remove()
      }
      if ($('div.add-edit-vendor').length == 0) {
         let vendorDiv = $('<div>').attr('class','add-edit-vendor')
             vendorDiv.html('<label>Full name of Vendor:</label><input type=\"text\" placeholder=\"Mr. E. Mann\"></input><label>Vendor email address:</label><input type=\"email\" placeholder=\"mysteryman@gmail.com\"></input>')

         let buttAdd = $('<button>').appendTo(vendorDiv)
            .attr('class','create-vendor')
            .text('Add')
            .click( ()=> {

               event.stopPropagation()
               let newVendorData = vendorFormCompile();
               if (newVendorData) {
                  $.ajax({
                     'beforeSend': verifyToken,
                     url: "/vendor/add",
                     method: "POST",
                     data: newVendorData
                  }).done((successful) => {
                     showAllVendors();
                  });
               }
            })

         vendorDiv.appendTo($('#angularize'))
      }
      getAllVendors()
   }

   function addBreak(element){
      element.append('<br>')
   }

   let showSvtdForm = function() {
      if ($('div.vendor-svtd')) {
         $('div.vendor-svtd').empty().remove()
      }
      let formDiv = $('<div>').attr('class','vendor-svtd')
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
         submitButt.attr('value',localStorage.myVendor)
      } else if (localStorage.myVendor) {
         localStorage.removeItem('myVendor')
      }

      formDiv.appendTo($('#angularize'))
   }

   let saveTheDate = function(){
      if (localStorage.myVendor) {
         let vendorUpdate = {
            'fullName': $('.vendor-svtd').children('input').eq(0).val() ,
            'id': localStorage.myVendor ,
            'street_1': $('.vendor-svtd').children('input').eq(1).val() ,
            'street_2': $('.vendor-svtd').children('input').eq(2).val() ,
            'apt': $('.vendor-svtd').children('input').eq(3).val() ,
            'city': $('.vendor-svtd').children('input').eq(4).val() ,
            'state': $('.vendor-svtd').children('select').eq(0).val() ,
            'zip': $('.vendor-svtd').children('input').eq(5).val() ,
            'phone': $('.vendor-svtd').children('input').eq(6).val() ,
            'notes': $('.vendor-svtd').children('textarea').eq(0).val()
         }
         $.ajax({
            url: "/vendor/svtd",
            method: "PUT",
            data: vendorUpdate
         }).done((successful) => {
            localStorage.removeItem(myVendor);
            localStorage.removeItem(tempName);
            showAllVendors(successful);
         });
      } else {
         alert('this is just an example')
      }

   }

   let showRsvpForm = function(){
      // $('.vendor-rsvp').hide()

      if ($('div.vendor-rsvp')) {
         $('div.vendor-rsvp').empty().remove()
      }

      let formDiv = $('<div>').attr('class','vendor-rsvp')
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
         .append('<label>Your vendor\'s entree:</label>')
         .appendTo(formDiv)

      for (var i in entreeChoices) {
         let radioButton = '<input type="radio" name="entreep" value="'+i+'">'+i
         formDiv.children('.entree-two').append(radioButton)
      }

      $('<div>').attr('class','diet-two')
         .append('<label>Your vendor\'s Dietary restrictions:</label>')
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
         $('.vendor-rsvp').children().eq(3).children('input').val(localStorage.tempName)
         submitButt.attr('value',localStorage.myVendor)
      } else if (localStorage.myVendor) {
         localStorage.removeItem('myVendor')
      }

      formDiv.appendTo($('#angularize'))

   }

   let saveRsvpResponse = function(){
      if (localStorage.myVendor) {
         let plusOne = function(){
            return ($('.vendor-rsvp').children('select').eq(0).val == "true") ? true : false;
         }
         let vendorUpdate = {
            'id': localStorage.myVendor ,
            'fullName': $('.vendor-rsvp').children().eq(3).children('input').val() ,
            'attending': $('input[name=attending]:checked').val() ,
            'entree': $('input[name=entree]:checked').val() ,
            'diet': $('.vendor-rsvp').children().eq(5).children('input').val() ,
            'plus': plusOne() ,
            'entreep': $('input[name=entreep]:checked').val() ,
            'dietp': $('.vendor-rsvp').children().eq(8).children('input').eq(0).val() ,
            'song': $('.vendor-rsvp').children().eq(9).children('input').eq(0).val() ,
            'message': $('.vendor-rsvp').children('textarea').eq(0).val()
         }
         $.ajax({
            // save the date info
            url: "/vendor/rsvp",
            method: "PUT",
            data: vendorUpdate
         }).done((successful) => {
            localStorage.removeItem(myVendor);
            localStorage.removeItem(tempName);
            showAllVendors(successful);
         });
      } else {
         // console.log('this is just an example');
         alert('this is just an example')
      }
   }

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
