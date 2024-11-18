const { default: mongoose } = require("mongoose");
const mongodb = require("mongoose");
const validator=require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
require("dotenv").config({ path: "config.env" });

const key = process.env.JWT_KEY || "asdfghjkl"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:2,
        maxLength:15,
    },
    lastName: {
        type: String,
        maxLength:20
    },
    emailId: {
        type: String,
        unique: true,
        lowercase:true,
        trim:true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        lowercase:true,
        validate(value){
            if(!['male',"female","other"].includes(value.toLowerCase())){
                 throw new Error("Gender Data is not valid")
            }
        }
    },
    image: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Image URL is not valid")
            }
        }
    },
    skills: {
        type: [String],
        validate(array){
            if(array.length > 5){
                throw new Error("Skills should not have more than 5 items")
            }
        }
    },
    about: {
        type: String,
        maxLength:50,
        trim:true
    }
},{timestamps:true})

// **************************************************schema methodes************************************************************

userSchema.methods.getJWT=async function(){
    const token=await jwt.sign({_id:this?._id},key)
    return token;
}

userSchema.methods.validatePassword=async function(password){
    const isPasswordCorrect = await bcrypt.compare(password, this.password);
    return isPasswordCorrect;

}

// const User=mongoose.model("User",userSchema);

// module.exports=User;

module.exports = mongoose.model("User", userSchema);