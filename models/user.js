const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
   firstName : {
      type: String,
      trim: true,
   },
   lastName : {
      type: String,
      trim: true,
   },
   username : {
      type: String,
      trim: true,
   },
   email : {
      type: String,
      trim: true,
   }, 
   password : String, 
   joined : {type: Date, default: Date.now()},
   gender : String,
   address : String,
   image : {
      type: String,
      default: "",
   },
   campusPresence : {type : Boolean, default : false},
   fines : {type : Number, default: 0},
   isAdmin : {type : Boolean, default : false},
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);