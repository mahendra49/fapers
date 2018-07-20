var express = require("express"),
    app     = express();
    
app.set("view engine","ejs");


//home page
app.get("/",function(req,res){
    res.render("home");
});

app.get("/find", (req,res)=>{
   res.render("find"); 
});


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server has started");
});
