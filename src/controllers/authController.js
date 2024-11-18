const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { validateUser } = require("../utils/validation");
require("dotenv").config({ path: "config.env" });
const key = process.env.JWT_KEY;

// Controller for user sign-up
const signUp = async (req, res) => {
    const { firstName, emailId, password, lastName, age, gender } = req.body;
    try {
        validateUser(req);
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({ ...req.body, "password": encryptedPassword });
        await user.save();
        res.status(201).send({
            success: true,
            message: "User created successfully",
        });
    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message,
        });
    }
};

// Controller for user login
const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            const error = new Error("Please Enter email and password");
            error.statusCode = 400;
            throw error;
        }
        if (!validator.isEmail(emailId)) {
            const error = new Error("Email is not valid");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ emailId });
        if (user) {
            const isPasswordCorrect = await user.validatePassword(password);
            if (isPasswordCorrect) {
                const token = await jwt.sign({ _id: user._id }, key);
                res.cookie("token", token);
                res.status(200).send({
                    success: true,
                    message: "User logged in successfully",
                });
            } else {
                const error = new Error("Email or Password is incorrect");
                error.statusCode = 400;
                throw error;
            }
        } else {
            const error = new Error("Email or Password is incorrect");
            error.statusCode = 400;
            throw error;
        }
    } catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message,
        });
    }
};

// Controller for user logout
const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).send({
            success: true,
            message: "User logged out",
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { signUp, login, logout };
