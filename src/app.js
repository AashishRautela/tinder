const express=require("express")
const connectDb=require("./config/database")
require("./config/database")
const User=require("./models/user");
const app=express();


app.post("/signUp", async (req,res)=>{
    const userObj={
        firstName:"Pawannnn",
        lastName:"fartyal",
        emailId:"asis@yopmail.com",
        password:"Ashish@123",
        age:24,
        gender:"Male"
    }

    const user=new User(userObj);
    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while creating the user");
    }
    
})

connectDb()
.then(()=>{
    console.log("Connected to database successfully");
    app.listen(3000,(req,res)=>{
        console.log("server is running");
    })
})
.catch((err)=>{
    console.log("Database connection failed");
})



