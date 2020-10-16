// importing dependencies
const fs = require('fs');

// importing models
const User = require('../models/user');

// importing utilities
const deleteImage = require('../utils/delete_image');

// GLOBAL_VARIABLES
const PER_PAGE = 10;

// admin -> show dashboard working procedure

exports.getDashboard = async(req, res, next) => {
    var page = req.query.page || 1;
    try{
        const users_count = await User.find().countDocuments() - 1;

        res.render("admin/index", {
            users_count : users_count,
            });   
    } catch(err) {
        console.log(err)
    }
}

// admin -> delete profile working procedure

exports.deleteAdminProfile = async(req, res, next) => {
    try{
        await User.findByIdAndRemove(req.user._id);
        res.redirect("/");
    } catch(err) {
        console.log(err);
        return res.redirect('back');
    }
}


// admin -> get user list
exports.getUserList = async (req, res, next) =>  {
    try {
        const page = req.params.page || 1;

        const users = await User
            .find()
            .sort('-joined')
            .skip((PER_PAGE * page) - PER_PAGE)
            .limit(PER_PAGE);

        const users_count = await User.find().countDocuments();

        res.render('admin/users', {
            users: users,
            current: page,
            pages: Math.ceil( users_count / PER_PAGE),
        });

    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
};

// admin -> show searched user
exports.postShowSearchedUser = async (req, res, next) => {
    try {
        const page = req.params.page || 1;
        const search_value = req.body.searchUser;

        const users = await User.find({
            $or: [
                {"firstName": search_value},
                {"lastName": search_value},
                {"username": search_value},
                {"email": search_value},
            ]
        });

        if(users.length <= 0) {
            req.flash("error", "User not found!");
            return res.redirect('back');
        } else {
            res.render("admin/users", {
                users: users,
                current: page,
                pages: 0,
            });
        }
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
};

// admin -> flag/unflag user
exports.getFlagUser = async (req, res, next) => {
    try {
        const user_id = req.params.user_id;

        const user = await User.findById(user_id);

        if(user.campusPresence) {
            user.campusPresence = false;
            await user.save();
            req.flash("warning", `A user named ${user.firstName} ${user.lastName} just exited!`);
        } else {
            user.campusPresence = true;
            await user.save();
            req.flash("success", `A user named ${user.firstName} ${user.lastName} just entered!`);
        }

        res.redirect("/admin/users/1");
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
};

// admin -> show one user
exports.getUserProfile = async (req, res, next) => {
    try {
        const user_id = req.params.user_id;

        const user = await User.findById(user_id);

        res.render("admin/user", {
            user: user
    });
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
}

// admin -> delete a user
exports.getDeleteUser = async (req, res, next) => {
    try {
        const user_id = req.params.user_id;
        const user = await User.findById(user_id);
        await user.remove();

        let imagePath = `images/${user.image}`;
        if(fs.existsSync(imagePath)) {
            deleteImage(imagePath);
        }

        res.redirect("/admin/users/1");
    } catch(err) {
        console.log(err);
        res.redirect('back');
    }
}

// admin -> get profile
exports.getAdminProfile = (req, res, next) => {
    res.render("admin/profile");
};