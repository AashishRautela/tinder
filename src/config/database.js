const mongoose =require("mongoose");
require("dotenv").config({ path: "config.env" });

const connectDb=async ()=>{
    await mongoose.connect(
        process.env.DB_URI
    )
}

module.exports=connectDb;

