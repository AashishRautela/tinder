const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

// API to sign up a new user
app.post("/signUp", async (req, res) => {
    const userObj = req.body;
    const user = new User(userObj);
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
app.patch("/user", async (req, res) => {
    const { id, ...updateFields } = req.body; // Extract `id` and update fields
    try {
        const data = await User.findByIdAndUpdate(id, updateFields, { new: true });
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
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
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
