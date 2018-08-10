//for authentication demo
// https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359

var mongoose                        = require("mongoose"),
    express                         = require("express"),
    app                             = express(),
    passport                        = require("passport"),
    bodyparser                      = require("body-parser"),
    Localstartegy                   = require("passport-local"),
    passportlocalmongoose           = require("passport-local-mongoose"),
    Faper                           = require("./models/fapers"),
    User                            = require("./models/users"),
    seedDB                          = require("./seed"),
    flash                           = require("connect-flash"),
    getColleges                     = require("./helper/collegeDB"),
    getSubjects                     = require("./helper/subjectDB");

var MongoClient = require('mongodb').MongoClient;
var url = process.env.DATABASEURL;
console.log(url);     

//seedDB();
getColleges();
getSubjects();


//public serving -- css etc
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/helper'));

app.use(flash());

passport.use(new Localstartegy(User.authenticate()));

app.use(require("express-session")({
    secret: "This is my first autun demo",
    resave: false,
    saveUninitialized: false
}));



//fetch all colleges 
var colleges;
MongoClient.connect(url, function(err, db) {
   if (err) throw err;
    var dbo = db.db("faper");
    dbo.collection("colleges").find({}).sort({college:1}).toArray(function(err, result) {
      if (err) throw err;
      colleges=result;
      db.close();
    });
});    

//fetch all subjects
var subjects;
MongoClient.connect(url, function(err, db) {
   if (err) throw err;
    var dbo = db.db("faper");
    dbo.collection("subjects").find({}).toArray(function(err, result) {
      if (err) throw err;
      subjects=result;
      db.close();
    });
});    





//middleware to provide currently logged in user to every template
//that next() is important because is then calls next thing ...if not provided not template will be rendered
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


mongoose.connect(process.env.DATABASEURL);
app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyparser.urlencoded({ extended: true }));

// route for home page
app.get("/",function(req,res){
    //this gives currently logged in user if any
    //console.log(req.user);
    res.render("home",{currentUser:req.user,message:req.flash("logout")});
});


app.get("/user", isLoggedIn,function(req,res){
    
    User.findOne({username:req.user.username}).populate("papers").exec(function(err,user){
        if(err){
            console.log(err);
            res.redirect("/login");
        }else{
            res.render("profile",{user:user});
        }
    });

});

//register 
app.get("/register",isLogged,function(req,res){
   res.render("register",{colleges:colleges});
});

app.post("/register",function(req, res) {

    var userdata = {
        username    : req.body.username,
        college     : req.body.college,
        email       : req.body.email,
        phonenumber : req.body.phonenumber,
    }
  
    User.register(userdata, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        
        passport.authenticate("local")(req, res, function() {
            res.redirect("/user");
        });
    });
});

//login route
app.get("/login",function(req,res){

    if(req.isAuthenticated()){
        res.redirect("/user");
    }
    res.render("login",{message:req.flash("error")});

});


//middleware here before actually logging in
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {
       
});


//find faper
app.get("/find", (req,res)=>{
    res.render("find",{colleges:colleges,subjects:subjects});
});


//complicated part
app.get("/findfaper",function(req,res){
  
    /*first get all users with given college
    then populate the papers field(with only given subject)
    and then lean to get JS object
    and finally filter users as some users have zero papers */ 
    User.find({college:req.query.college}).populate({
            path: 'papers',
            match: { subject: { $eq: req.query.subject }},
        }).lean().
        exec(function(err,founddata){
        if(err){
            console.log("error in finding data");
        }
        else{
            //console.log(founddata);
            founddata = founddata.filter(function(user){return user.papers.length !=0});
            res.render("fapers",{fapers:founddata});
        }
    });

});

//route to render post a paper page
app.get("/postpaper",isLoggedIn,function(req,res){
    res.render("postpaper",{subjects:subjects});
});

//route to register a paper to a user
app.post("/postpaper",isLoggedIn,checkdata,function(req,res){
    //save to db a paper with owner id
    var paperdata =  {
        department:req.body.department,
        subject:req.body.subject

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
                            res.redirect("/user");
                        }
                    });
                }
             });
        }
    });
});


app.get("/logout", function(req, res) {
    req.logout();
    req.flash("logout","logged you out");
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","Please login");
    res.redirect("/login");
}

function isLogged(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

function checkdata(req,res,next){


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
                if(paper.subject==req.body.subject){
                    console.log("already exits");
                    exists=true;
                    
                }
            });

            //is this asynchonous ?? if else is removed
            if(exists){
                res.redirect("/");
            }else{
               next();
            }
            
        }    

     });   

}

app.listen(process.env.PORT,process.env.IP, function() {
    console.log("server has started"+process.env.IP);
});
