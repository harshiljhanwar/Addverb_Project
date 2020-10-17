# Addverb_Project
Campus Entry Control System

## Techonologies used in this application

### Front-end

1. HTML5
2. CSS3
3. BOOTSTRAP 4
4. jQuery

### Back-end

1. MongoDB
2. Express.js
3. Node.js
4. Passport.js

## Install dependencies
Open command line tools at application file and run following npm command or just look at `package.json` file to know the dependencies.

`npm install passport passport-local passport-local-mongoose body-parser connect-flash ejs express express-sanitizer express-session method-override mongoose fs path --save`

#### Install dev dependencies if needed
`npm install nodemon faker --save-dev`

## Run the application
All data in this application stored in MongoDB. Make sure MongoDB installed in your machine or environment. Keep `mongod` running on background and run `node app.js` on app folder.

## Functionalitites

Whole app is divided into two modules.

* Admin
* User

### Admin module functionalities
* Sign up (This route is hidden. Only accessible by typing the route manually and when admin log in)
* Login
* Logout
* Find users by firstname, lastname, email and username
* Mark Entry and Exit
* Delete user acount
* Delete currently logged in admin profile

### User module functionalities
* Sign up
* Login
* Profile
* Logout
