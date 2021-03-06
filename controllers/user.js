// importing models
const User = require("../models/user");

//user -> dashboard
exports.getUserDashboard = async(req, res, next) => {
    const user_id = req.user._id;

    try {
        // fetch user info from db
        const user = await User.findById(user_id);

        res.render("user/index", {
            user : user,
        });
    } catch(err) {
        console.log(err);
        return res.redirect('back');
    }
}

// user -> profile
exports.getUserProfile = (req, res, next) => {
    res.render("user/profile");
}

