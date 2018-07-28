var mongoose = require("mongoose"),
    User     = require("./models/users");


function seedDB(){
    User.remove({},function(err){
        if(err){
            console.log("error during seeding db");
        }
        console.log("all good here");
    });
}

     
module.exports = seedDB;