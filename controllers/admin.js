// importing dependencies
const fs = require('fs');

// importing models
//const Book = require('../models/book');
const User = require('../models/user');
const Activity = require('../models/activity');
//const Issue = require('../models/issue');
//const Comment = require('../models/comment');

// importing utilities
const deleteImage = require('../utils/delete_image');

// GLOBAL_VARIABLES
const PER_PAGE = 10;

// admin -> show dashboard working procedure
/*
    1. Get user, book and activity count
    2. Fetch all activities in chunk (for pagination)
    3. Render admin/index
*/
exports.getDashboard = async(req, res, next) => {
    var page = req.query.page || 1;
    try{
        const users_count = await User.find().countDocuments() - 1;
        const activity_count = await Activity.find().countDocuments();
        const activities = await Activity
            .find()
            .sort('-entryTime')
            .skip((PER_PAGE * page) - PER_PAGE)
            .limit(PER_PAGE);

        res.render("admin/index", {
            users_count : users_count,
            //books_count : books_count,
            activities : activities,
            current : page,
            pages: Math.ceil(activity_count / PER_PAGE),
            });   
    } catch(err) {
        console.log(err)
    }
}

// admin -> search activities working procedure
/*
    1. Get user and book count
    2. Fetch activities by search query
    3. Render admin/index
    **pagination is not done
*/
exports.postDashboard = async(req, res, next) => {
    try {
        const search_value = req.body.searchUser;
        
        // getting user
        const users_count = await User.find().countDocuments();

        // fetching activities by search query
        const activities = await Activity
            .find({
                $or : [
                    {"user_id.username" :search_value},
                    {"category" : search_value}
                ]
            });

        // rendering
        res.render("admin/index", {
            users_count: users_count,
            activities: activities,
            current: 1,
            pages: 0,
        });      
        
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// admin -> delete profile working procedure
/*
    1. Find admin by user_id and remove
    2. Redirect back to /
*/
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

        if(user.violationFlag) {
            user.violationFlag = false;
            await user.save();
            req.flash("success", `An user named ${user.firstName} ${user.lastName} is just unflagged!`);
        } else {
            user.violationFlag = true;
            await user.save();
            req.flash("warning", `An user named ${user.firstName} ${user.lastName} is just flagged!`);
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
        const issues = await Issue.find({"user_id.id": user_id});
        const comments = await Comment.find({"author.id": user_id});
        const activities = await Activity.find({"user_id.id": user_id}).sort('-entryTime');

        res.render("admin/user", {
            user: user,
            issues: issues,
            activities: activities,
            comments: comments,
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

        await Issue.deleteMany({"user_id.id": user_id});
        await Comment.deleteMany({"author.id": user_id});
        await Activity.deleteMany({"user_id.id": user_id});

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