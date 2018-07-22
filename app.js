var express = require("express"),
    app     = express();


app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");


// route for home page
app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/sign-up",function(req,res){
  res.render("signup");
});

app.get("/find", (req,res)=>{
   res.render("find"); 
});


app.listen(3000, function() {
    console.log("server has started");
});
