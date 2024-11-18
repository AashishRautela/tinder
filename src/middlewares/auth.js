const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "config.env" });
const key = process.env.JWT_KEY
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if(!token){
            const error = new Error("Token is not valid");
            error.statusCode = 401
            throw error
        }
        const decodedData = await jwt.verify(token, key)
        const { _id } = decodedData;
        const user = await User.findOne({ _id: _id });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 400
            throw error
        }
        req.user=user;
        next()
    }
    catch (error) {
        res.status(error.statusCode || 500).send({
            sucess: false,
            message: error.message || "Something went wrong"
        })
    }
}

module.exports={userAuth}