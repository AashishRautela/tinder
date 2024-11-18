const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const validator = require("validator")
const { validateUser } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config({ path: "config.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3001;
const key = process.env.JWT_KEY || "Ashish"
// API to sign up a new user
app.post("/user", async (req, res) => {
    const { firstName, emailId, password, lastName, age, gender } = req.body;
    try {
        validateUser(req);
        const encryptedPassowrd = await bcrypt.hash(password, 10)
        console.log('encryptedPassowrd', encryptedPassowrd)
        const user = new User({ ...req.body, "password": encryptedPassowrd });
        await user.save();
        res.status(201).send({
            success: true,
            message: "User created successfully"
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message
        });
    }
});

//login
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!emailId || !password) {
            const error = new Error("Please Enter email and password")
            error.statusCode = 400
            throw error
        }
        if (!validator.isEmail(emailId)) {
            const error = new Error("Email is not valid");
            error.statusCode = 400
            throw error;
        }
        const user = await User.findOne({ "emailId": emailId });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                const token = await jwt.sign({ _id: user?._id }, key)
                res.cookie("token", token)
                res.status(200).send({
                    success: true,
                    message: "User loged in successfully"
                })
            }
            else {
                const error = new Error("Email or Password is incorrect");
                error.statusCode = 400
                throw error;
            }
        }
        else {
            const error = new Error("Email or Password is incorrect");
            error.statusCode = 400
            throw error;
        }
    }
    catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message
        })
    }
})

// API to fetch a user
app.get("/user", async (req, res) => {
    const { id } = req.body;
    try {
        const response = await User.find({ _id: id });
        res.status(200).send({
            success: true,
            data: response || []
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error fetching data",
            error: error.message
        });
    }
});

//get profile
app.get("/profile", async (req, res) => {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Please log in.",
        });
    }

    try {
        const decodedToken = await jwt.verify(token, key);
        const user = await User.findOne({ _id: decodedToken._id });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found.",
            });
        }

        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).send({
            success: true,
            data: userObject,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
});



// API to fetch all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        const data=users.map((user)=>{
                let temp=user.toObject();
                delete temp.password;
                return temp
        })
        res.status(200).send({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "Error fetching data",
            error: error.message
        });
    }
});

// API to delete a user by ID
app.delete("/user", async (req, res) => {
    const { id } = req.body;
    try {
        const data = await User.findByIdAndDelete(id);
        if (data) {
            res.status(200).send({
                success: true,
                message: "User deleted successfully"
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
});

// API to update a user by ID
app.patch("/user/:id", async (req, res) => {
    const id = req.params?.id
    const { ...updateFields } = req.body;

    try {
        const emailId = updateFields?.emailId;
        if (emailId) {
            const user = await User.findOne({ "emailId": emailId });

            if (user) {
                if (user._id.toString() === id) {
                    res.status(400).send({
                        success: false,
                        message: "Email ID is already associated with your account",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        message: "Email ID is already registered with another user",
                    });
                }
                return;
            }
        }

        const notAllowedToUpdate = [""];
        const isAllowed = Object.keys(updateFields).every(key => !notAllowedToUpdate.includes(key));
        if (!isAllowed) {
            throw new Error("Update not allowed")
        }
        const data = await User.findByIdAndUpdate(id, updateFields, { returnDocument: "after", runValidators: true });
        if (data) {
            res.status(200).send({
                success: true,
                message: "User updated successfully",
                data
            });
        } else {
            res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
});

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
