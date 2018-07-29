var mongoose = require("mongoose"),
    User     = require("./models/users"),
    Faper     = require("./models/fapers");


function seedDB(){
    

    User.remove({},function(err){
        if(err){
            console.log("error during seeding db");
        }
        console.log("all users removed");
    });


    Faper.remove({},function(err){
        if(err){
            console.log("error during seeding db");
        }
        console.log("all fapers removed");
    });

}

     
module.exports = seedDB;