# PlanThisWeddingFor.Me!

**Heroku Link: https://plan-this-wedding-for-me.herokuapp.com/**

---

## Table of Contents
1. [Mission Statement](#mission-statement)
2. [Technologies](#technologies-used)
3. [Wireframes/Flow diagrams](#wireframes)
4. [User Stores](#user-stories)
5. [Credits](#coded-and-designed-by)
6. [Copyright Notice](#copyright-notice)

---

### Mission statement

Wedding planning **sucks,** specifically keeping track of information:
  1. guest addresses for sending Save The Dates
  1. guest RSVP responses
  1. vendor information
  1. vendor payment tracking

*PlanThisWeddingFor.Me* helps mitigate the suck by keeping your information organized, and allowing all the members of your planning team to view and manage the same information.

#### Technologies used:

1. Node and Express
1. MongoDb, Mongoose
1. bcrypt
1. nodemailer
1. node-scheduler


#### Wireframes

| Landing | login/signup | Account Views | Guest Views |
|---------|--------------|-----|----|
|![Landing page](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Landing.png)|![Signup Screen](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Signup.png)|![View/Add/Edit guests](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-account-view.png)|![Guest SVTD form](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-guest-svtd.png)|
|![Landing-Video](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Landing-Video.png)|![Signin Screen](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Signin.png)|![View/Edit/Add Vendors](TBD)|![Guest RSVP form](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-guest-rsvp.png)|
| | |![Edit Account](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-edit-account.png)|

#### User stories:

##### Account Owner/Couple/Wedding Planner:
1. [x] create an account with up to three different email addresses.
1. [x] login using any of three addresses and password
1. [x] add guests (name and email only) to their list
1. [x] edit/delete Guests
1. [x] sort guests by save the date or rsvp completion status.
1. [x] collect and view guest responses
1. [x] email guests reminders to complete their information
1. [x] add vendors to their vendor list

##### Invited Guests
1. [x] receive custom link via an email
1. [x] edit contact information (fill out svtd form)
1. [x] fill out rsvp card
1. [x] update information without creating account/loggin in

##### Future features:
1. [ ] scheduling/mass emails
1. [ ] email new password if forgotten Password
1. [ ] tooltips
1. [ ] implement angular/react on front end
1. [ ] send emails to vendors
1. [ ] send emails to themselves or team members

## Coded and Designed By:

**Rachel Smyth** [(Github - RachelScodes)](https://github.com/RachelScodes)

Markdown Template from: **[Mix.r](https://github.com/RachelScodes/mymix)**

##### Copyright Notice
The images and fonts used in this app are for an educational project only and not for mass distribution or for profit.
