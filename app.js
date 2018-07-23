var express = require("express"),
    app     = express();


app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


// route for home page
app.get("/",function(req,res){
    res.render("home");
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

// login logic goes here
app.post("/login",function(req,res){
    console.log("login success");
    res.render("profile");
});

app.listen(3000, function() {
    console.log("server has started");
});
