# PlanThisWeddingFor.Me!

** Heroku Link: https://plan-this-wedding-for-me.herokuapp.com/**

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
  - guest addresses for sending Save The Dates
  - guest RSVP responses
  - vendor informations

*PlanThisWeddingFor.Me* helps mitigate the suck by keeping your information organized, and allowing all the members of your planning team to view and manage the same information.

#### Technologies used:

  - Node and Express
  - MongoDb, Mongoose
  - bcrypt
  - nodemailer
  - node-scheduler


#### Wireframes

| Landing | login/signup | Account Views | Guest Views |
|---------|--------------|-----|----|
|![Landing page](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Landing.png)|![Signup Screen](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Signup.png)|![View/Add/Edit guests](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-account-view.png)|![Guest SVTD form](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-guest-svtd.png)|
|![Landing-Video](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Landing-Video.png)|![Signin Screen](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-Signin.png)|![View/Edit/Add Vendors](TBD)|![Guest RSVP form](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-guest-rsvp.png)|
| | |![Edit Account](https://raw.githubusercontent.com/RachelScodes/weddingPA/master/resources/SS-edit-account.png)|

#### User stories:

##### Account Owner/Couple/Wedding Planner:
  - create an account with up to three different email addresses.
  - login using any of three addresses and password
  - add guests (name and email only) to their list
    - edit/delete Guests
    - sort guests by save the date or rsvp completion status.
    - collect and view guest responses
    - email guests reminders to complete their information
  - add vendors to their vendor list
    - send emails to vendors, or to themselves to remind them to contact said vendor

##### Invited Guests
  - receive custom link via an email
  - edit contact information (fill out svtd form)
  - fill out rsvp card
  - update information without creating account/loggin in

##### Future features:
  - scheduling/mass emails
  - email new password if forgotten Password
  - tooltips
  - implement angular/react on front end

## Coded and Designed By:

**Rachel Smyth**
Github: [RachelScodes](https://github.com/RachelScodes)

Markdown Template from: **[Mix.r](https://github.com/RachelScodes/mymix)**

## Copyright Notice
The images and fonts used in this app are for an educational project only and not for mass distribution or for profit.
