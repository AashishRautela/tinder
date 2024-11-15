const express = require("express")
const connectDb = require("./config/database")
require("./config/database")
const User = require("./models/user");
const app = express();

app.use(express.json());


app.post("/signUp", async (req, res) => {

    const userObj = req.body
    const user = new User(userObj);
    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while creating the user");
    }
})

app.get("/user", async (req, res) => {
    const user = req.body.firstName
    try {
        const response = await User.find({ firstName: user })
        if (response?.length) {
            res.status(200).send({
                success: true,
                data: response
            })
        }
        else {
            res.status(200).send({
                success: true,
                data: []
            })
        }
    }
    catch (error) {
        res.status(400).send("Error fetching data", response);
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        if (response?.length) {
            res.status(200).send({
                success: true,
                data: users
            })
        }
        else {
            res.status(200).send({
                success: true,
                data: []
            })
        }
    }
    catch (error) {
        res.status(400).send("Error fetching data");
    }

})

app.delete("/user", async (req, res) => {
    const user = req.body.id
    try {
        const data = await User.findByIdAndDelete({ _id: user })
        if(data){
            res.status(200).send({
                success: true,
                message: "User Deleted Successfully"
            })
        }
        else{
            res.status(200).send({
                success:true,
                message:"User Not found"
            })
        }
    }
    catch(error) {
        res.status(400).send("Error deleting user");
    }
})

app.patch("/user", async (req, res) => {
    const user = req.body;
    const { id } = req.body; // Assuming `id` is sent in the request body
    try {
        const data = await User.findByIdAndUpdate(id, user);
        if (data) {
            res.status(200).send({
                success: true,
                message: "User updated successfully"
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
            message: "Internal server error",
            error: error.message
        });
    }
});


connectDb()
    .then(() => {
        console.log("Connected to database successfully");
        app.listen(3000, (req, res) => {
            console.log("server is running");
        })
    })
    .catch((err) => {
        console.log("Database connection failed");
    })



