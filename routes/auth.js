const express = require("express"),
      router = express.Router(),
      passport = require('passport');


// Import index controller
const campusController = require('../controllers/auth');

// Import models
const User = require("../models/user");

//landing page
router.get('/', campusController.getLandingPage);

//admin login handler
router.get("/auth/admin-login", campusController.getAdminLoginPage)

router.post("/auth/admin-login", passport.authenticate("local", {
        successRedirect : "/admin",
        failureRedirect : "/auth/admin-login",
    }), (req, res)=> {
});

//admin logout handler
router.get("/auth/admin-logout", campusController.getAdminLogout);


// admin sign up handler
router.get("/auth/admin-signup", campusController.getAdminSignUp);

router.post("/auth/admin-signup", campusController.postAdminSignUp);

//user login handler
router.get("/auth/user-login", campusController.getUserLoginPage);

router.post("/auth/user-login", passport.authenticate("local", {
        successRedirect : "/user/1",
        failureRedirect : "/auth/user-login",
    }), (req, res)=> {
});

//user -> user logout handler
router.get("/auth/user-logout", campusController.getUserLogout);

//user sign up handler
router.get("/auth/user-signUp", campusController.getUserSignUp);

router.post("/auth/user-signup", campusController.postUserSignUp);

module.exports = router;