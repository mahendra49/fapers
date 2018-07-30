//for authentication demo
// https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359

var mongoose                        = require("mongoose"),
    express                         = require("express"),
    app                             = express(),
    passport                        =require("passport"),
    bodyparser                      = require("body-parser"),
    Localstartegy                   = require("passport-local"),
    passportlocalmongoose           = require("passport-local-mongoose");
    Faper                           = require("./models/fapers");
    User                            = require("./models/users"),
    seedDB                          = require("./seed"),
     

//seedDb
//seedDB();


//public serving -- css etc
app.use(express.static(__dirname + '/public'));

passport.use(new Localstartegy(User.authenticate()));

app.use(require("express-session")({
    secret: "This is my first autun demo",
    resave: false,
    saveUninitialized: false
}));


//middleware to provide currently logged in user to every template
//that next() is important because is then calls next thing ...if not provided not template will be rendered
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

mongoose.connect("mongodb://localhost/faper");
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
    res.render("home",{currentUser:req.user});
});


app.get("/userprofile", isLoggedIn,function(req,res){
    
    User.findOne({username:req.user.username}).populate("papers").exec(function(err,user){
        if(err){
            console.log(err);
            res.redirect("/login");
        }else{
            console.log(user.papers.length);
            res.render("profile",{user:user});
        }
    });

});

//register 
app.get("/sign-up",function(req,res){
  res.render("signup");
});

app.post("/register", function(req, res) {

  var userdata = {
        username    : req.body.username,
        college     : req.body.college,
        email       : req.body.email,
        phonenumber : req.body.phonenumber,
  }
  
  User.register(userdata, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("signup");
        }
        
        passport.authenticate("local")(req, res, function() {
            res.redirect("/userprofile");
        });
    });
});

//login route
app.get("/login",function(req,res){
    console.log(req.body);
    if(req.isAuthenticated()){
        res.redirect("userprofile");
    }
    res.render("login");

});


//middleware here before actually logging in
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {
       
});


//find faper
app.get("/find", (req,res)=>{

   res.render("find"); 
});


//complicated part
app.get("/findfaper",function(req,res){
  
   //stack overflow and mongoose doc comes to rescue
   var college = req.query.college;
   var subject = req.query.subject;
   User.
   find({college:college},"username").
   populate({
    path: 'papers',
    match: { subject: { $eq: subject }},
    
  }).
  exec(function(err,founddata){
    if(err){
        console.log("error in finding data");
    }
    else{
        console.log(founddata[1].papers);
        console.log(founddata[1].username);
    }
  });

    
});

//route to render post a paper page
app.get("/postpaper",isLoggedIn,function(req,res){
    res.render("postpaper");
});

//route to register a paper to a user
app.post("/postpaper",isLoggedIn,function(req,res){
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
                            console.log(data);
                            res.redirect("/userprofile");
                        }
                    });
                }
             });
        }
    });
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function() {
    console.log("server has started");
});
