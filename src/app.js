const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser")
require("dotenv").config({ path: "config.env" });
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;

//routes
app.use("/",authRouter);
app.use("/request",requestRouter);
app.use("/profile",profileRouter);
app.use("/user",userRouter);


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
