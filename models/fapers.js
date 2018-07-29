var mongoose = require("mongoose");
   
var faperschema = new mongoose.Schema({
    
    department:{
        type:String,
        require:true
    },
    subject:{
        type:String,
        required:true
    }
});


module.exports = mongoose.model("Faper",faperschema);