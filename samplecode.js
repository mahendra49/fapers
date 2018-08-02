//find user
//find all papers of that user

var mongoose                = require("mongoose");
mongoose.connect("mongodb://localhost/faper");

var Faper                   = require("./models/fapers");
var User                    = require("./models/users");

 //save to db a paper with owner id
    var paperdata =  {
        department:req.body.department,
        subject:req.body.subject

    }

    User.findOne({username:req.user.username}).populate("papers").lean().exec(function(err,founduser){
        if(err){
            console.log("error");
            res.redirect("/login");
        }
        else{
            var exists=false;
            var papers = founduser.papers;
            console.log(papers);
            papers.forEach(function(paper){
                if(paper.subject==paperdata.subject){
                    console.log("already exits");
                    exists=true;
                    
                }
            });

            if(exists){
                res.redirect("/userprofile");
            }

            Faper.create(paperdata,function(err,paperdata){
                if(err){
                    console.log("error in crating paper");
                    res.redirect("/postpaper");
                }
                else{
                    User.findOne({username:req.user.username},function(err,founduser){
                        if(err){
                            console.log("error in finding user");
                            res.redirect("/login");
                        }else{
                            founduser.papers.push(paperdata);
                            founduser.save(function(err,data){
                                if(err){
                                    console.log("error in sacing post, try again");
                                    res.redirect("/postpaper");
                                }
                                else{
                                    //console.log(data);
                                    res.redirect("/userprofile");
                                }
                            });
                        }
                    });
                }
            }); 

            
        }
    });