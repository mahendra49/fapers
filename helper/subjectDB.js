//find user
//find all papers of that user

var mongoose                = require("mongoose");
mongoose.connect("mongodb://localhost/faper");

function getSubjects(){
    var fs = require('fs');
    var readline = require('readline');


    //write all colleges to database
    var rd = readline.createInterface({
        input: fs.createReadStream('helper/subjects.txt'),
        output: process.stdout,
        console: false
    });

    var subject = new mongoose.Schema({
        subject:String
    });


    var Subject = mongoose.model("Subject",subject);

    rd.on('line', function(line) {
        Subject.create({subject:line},function(err,subject){
            if(err){
                console.log("error");
            }
            else{
                //console.log(subject);
            }
        });
    });

}

module.exports=getSubjects;