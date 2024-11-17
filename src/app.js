const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const validator=require("validator")

const app = express();
app.use(express.json());

// API to sign up a new user
app.post("/user", async (req, res) => {
    const { firstName, emailId, password, lastName, age, gender } = req.body;
    if (!firstName || !emailId || !password) {
        return res.status(400).send({
            success: false,
            message: "Request Data Missing."
        });
    }
    if(emailId && !validator.isEmail(emailId)){
        return res.status(400).send({
            success: false,
            message: "Please Enter a valid email."
        });
    }
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send({
            success: true,
            message: "User created successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: "An error occurred while creating the user",
            error: err.message
        });
    }
});

// API to fetch a user by firstName
app.get("/user", async (req, res) => {
    const { firstName } = req.body;
    try {
        const response = await User.find({ firstName });
        res.status(200).send({
            success: true,
            data: response || []
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

// API to fetch all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            success: true,
            data: users || []
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
    const id=req.params?.id
    const {...updateFields } = req.body;

    try {
        const emailId=updateFields?.emailId;
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
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });
