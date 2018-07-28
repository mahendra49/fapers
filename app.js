//for authentication demo
// https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359

var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    passport =require("passport"),
    bodyparser  = require("body-parser"),
    Localstartegy = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose");
    User = require("./models/users"),
    seedDB = require("./seed");
     

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
    
    //this is actually not needed ,we can use req.user 
    //but just for practice
    User.find({username:req.user.username},function(err,Luser){
        if(err){
            console.log("not signed in maybe : ");
            res.redirect("/login");
        }
        else{
            console.log(Luser);
            res.render("profile",{user:Luser[0]});
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

app.get("/findfaper",function(req,res){
    res.render("fapers");
});

//fapers
app.get("/fapers",function(req,res){
    res.render("fapers");
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
