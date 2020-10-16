// importing modules
const express = require("express"),
      router = express.Router(),
      middleware = require("../middleware");

// importing controller
const campusController = require('../controllers/user');

// user -> dashboard
router.get("/user/:page", middleware.isLoggedIn, campusController.getUserDashboard);

// user -> profile
router.get("/user/:page/profile", middleware.isLoggedIn, campusController.getUserProfile);

module.exports = router;