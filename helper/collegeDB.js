//find user
//find all papers of that user

var mongoose                = require("mongoose");
mongoose.connect(process.env.DATABASEURL);
var fs = require('fs');
var readline = require('readline');


//write all colleges to database
var rd = readline.createInterface({
    input: fs.createReadStream('helper/colleges.txt'),
    //output: process.stdout,
    console: false
});

var college = new mongoose.Schema({
    college:{
        type:String,
        unique:true
    }
});


var College = mongoose.model("College",college);

rd.on('line', function(line) {
    College.create({college:line},function(err,college){
        if(err){
            console.log("error");
        }
        else{
            //console.log(college);
        }
    });
});


module.exports=College;