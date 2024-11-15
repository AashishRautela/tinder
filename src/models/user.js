const { default: mongoose } = require("mongoose");
const mongodb=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        // require:true
    },
    emailID:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
})

// const User=mongoose.model("User",userSchema);

// module.exports=User;

module.exports=mongoose.model("User",userSchema);