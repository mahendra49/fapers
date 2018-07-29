//find user
//find all papers of that user

var mongoose                = require("mongoose");
mongoose.connect("mongodb://localhost/faper");

var Faper                   = require("./models/fapers");
var User                    = require("./models/users");



User.findOne({username:"mahendra"}).populate("papers").exec(function(err,user){
    if(err){
        console.log(err);
    }else{
        console.log(user);
    }
});