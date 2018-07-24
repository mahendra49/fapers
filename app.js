var express     = require("express"),
    app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    User = require("./models/users"),
    passport =require("passport"),
    Localstartegy = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose"),
    expressSanitizer = require("express-sanitizer"); 




passport.use(new Localstartegy(User.authenticate()));

app.use(require("express-session")({
    secret: "This is my first autun demo",
    resave: false,
    saveUninitialized: false
}));


mongoose.connect("mongodb://localhost/faper");

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// route for home page
app.get("/",function(req,res){
    res.render("home");
});


//middleware here before actually logging in
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {
        console.log("success log in ");
        res.render("profile");
});

app.post("/register", function(req, res) {

    var userdata = req.body.user;
    
    User.register(new User({ username: userdata.username }), userdata.password, function(err, user) {
        if (err) {
            console.log("error");
            res.render("/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/userprofile");
        });
    });
});



//login route
app.get("/login",function(req,res){
    res.render("login");
});

app.get("/userprofile",function(req,res){
    res.render("profile");
});

//register 
app.get("/sign-up",function(req,res){
  res.render("signup");
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


app.listen(process.env.PORT,process.env.IP , function() {
    console.log("server has started");
});
