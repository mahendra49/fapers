var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");

var userschema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        require:true,
    },
    phonenumber:{
        type:String,
        required:true
    }
    ,
    password:{
        type:String,
    },
    college:{
        type:String,
        required:true
    }
   
});

userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", userschema);
