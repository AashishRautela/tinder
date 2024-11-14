const express=require("express")

const app=express();

app.get("/",(req,res)=>{
    res.send("Hellosdljh")
})

app.get("/test",(req,res)=>{
    res.send("<><><>")
})

app.listen(3000,(req,res)=>{
    console.log("server is running");
})