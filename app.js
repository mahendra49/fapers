var express     = require("express"),
    app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose");


mongoose.connect("mongodb://localhost/faper");

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


// route for home page
app.get("/",function(req,res){
    res.render("home");
});

//register logic goes here
app.post("/register" ,function(req,res){
    console.log(req.body.user);

    res.render("profile");

});



//login route
app.get("/login",function(req,res){
    res.render("login");
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

// login logic goes here and auth logic goes here
app.post("/login",function(req,res){
    
    // check for authentication here
    console.log(req.body.login);

    // database query goes here


    // query result goes to profile template
    var profile = req.body.login;
    res.render("profile",{profile:profile});
});

//fapers
app.get("/fapers",function(req,res){
    res.render("fapers");
});

app.listen(3000, function() {
    console.log("server has started");
});
