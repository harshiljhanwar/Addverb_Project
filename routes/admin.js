const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      middleware = require("../middleware"),
      User = require("../models/user");

// importing controller
const campusControl = require('../controllers/admin');

//admin -> dashboard
router.get("/admin", middleware.isAdmin, campusControl.getDashboard);

//admin -> delete profile
router.delete("/admin/delete-profile", middleware.isAdmin, campusControl.deleteAdminProfile);

//admin -> users list 
router.get("/admin/users/:page", middleware.isAdmin, campusControl.getUserList);

//admin -> show searched user
router.post("/admin/users/:page", middleware.isAdmin, campusControl.postShowSearchedUser);

//admin -> flag/unflag user
router.get("/admin/users/flagged/:user_id", middleware.isAdmin, campusControl.getFlagUser);

//admin -> show one user
router.get("/admin/users/profile/:user_id", middleware.isAdmin, campusControl.getUserProfile);

// admin -> delete a user
router.get("/admin/users/delete/:user_id", middleware.isAdmin, campusControl.getDeleteUser);

//admin -> profile
router.get("/admin/profile", middleware.isAdmin, campusControl.getAdminProfile);

module.exports = router;