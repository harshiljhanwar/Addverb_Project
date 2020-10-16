const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    path = require("path"),
    sanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    localStrategy = require("passport-local"),
    fs = require("fs"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    userRoutes = require("./routes/users"),
    adminRoutes = require("./routes/admin"),
    authRoutes = require("./routes/auth"),
    middleware = require("./middleware"),
    deleteImage = require('./utils/delete_image');

mongoose.connect('mongodb://localhost:27017/eems', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
 
// app config
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(sanitizer());


//PASSPORT CONFIGURATION

app.use(require("express-session") ({ //must be declared before passport session and initialize method
    secret : "Wubba lubba dub dub",
    saveUninitialized : false,
    resave : false
}));
app.use(flash());

app.use(passport.initialize()); //must declared before passport.session()
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
   res.locals.currentUser   = req.user;
   res.locals.error         = req.flash("error");
   res.locals.success       = req.flash("success");
   res.locals.warning       = req.flash("warning"); 
   next();
});


//Routes
app.use(userRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.use(deleteImage)

app.listen(3000, () =>{
   console.log(`LMS server is running at: http://localhost:3000`); 
});
    