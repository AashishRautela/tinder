const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const validator = require("validator")
const { validateUser } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "config.env" });
const {userAuth}=require("./middlewares/auth")
const {getFullName}=require("./utils/common")
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;
const key = process.env.JWT_KEY || "asdfghjkl"

//routes
app.use("/request,",requestRouter)
app.use("/",authRouter);
app.use("/profile",profileRouter)


// Connect to the database and start the server
connectDb()
    .then(() => {
        console.log("Connected to database successfully");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });
