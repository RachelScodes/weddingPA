{
   _id
   greeting: 'Mr & Mrs. Smyth',
   emails: 'email1@gmail.com,email2@yahoo.com,email3@hotmail.com', // planner/bride/groom
   password: 'test',
   guests: [
      {  party: 1, // linkId of account
         index: 0, // id of guest[index]
         rsvp: true,
         name: 'Kaiti English',
         email: 'guest@email.com',
         contact: {
            street_1: '11 Testwood Lane',
            city: 'Anytown',
            state: 'NY',
            zip: '00000',
            phone: 2121234567,
         }
      },{
      party: 1, // linkId of account
         index: 1, // id of guest[index]
         rsvp: false,
         name: 'Nicole Rossi',
         email: 'guest2@email.com',
         contact: {
            street_1: '',
            street_2: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
            phone: 0,
         }
      },{
      party: 1, // linkId of account
         index: 2, // id of guest[index]
         rsvp: false,
         name: 'David Ivy',
         email: 'eabod@email.com',
         contact: {
            street_1: '',
            street_2: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
            phone: 0,
         }
      },{
      party: 1, // linkId of account
         index: 3, // id of guest[index]
         rsvp: true,
         name: 'Momma Smyth',
         email: 'guest@email.com',
         contact: {
            street_1: 'Testwood Lane',
            apt: '11P'
            city: 'Anytown',
            state: 'NY',
            zip: '00010',
            phone: 2121234569,
         }
      }
   ]
});
