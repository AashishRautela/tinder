const User = require("../models/user");

//get user profile
const userProfile = async (req, res) => {
    try {
        const user = req.user;
        const userObject = user.toObject();
        delete userObject.password; // remove the password from user object

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
}


//update user profile
const updateProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const notAllowed = ["emailId","password"];
        // const { emailId } = req.body;
        // if (emailId && req.user.emailId) {
        //     return res.status(400).send({
        //         success: false,
        //         message: `You are not allowed to update the emailId`
        //     });
        // }
        // else if (emailId && !req.user.emailId) {
        //     const user = await User.find({ emailId: emailId })
        //     if (user) {
        //         return res.status(400).send({
        //             success: false,
        //             message: `Email already exist`
        //         });
        //     }
        // }
        const toBeUpdatedFields = Object.keys(req.body);

        const restrictedFields = toBeUpdatedFields.filter(field => notAllowed.includes(field));
        if (restrictedFields.length > 0) {
            return res.status(400).send({
                success: false,
                message: `You are not allowed to update the following fields: ${restrictedFields.join(", ")}`
            });
        }

        const user = await User.findByIdAndUpdate(_id, req.body, { returnDocument: "after", runValidators: true })
        const data = user.toObject();
        delete data.password
        if (user) {
            res.status(200).send({
                sucess: true,
                message: "Profile Updated Successfully",
                data: data
            })
        }
        else {
            const error = new Error("User not found");
            error.statusCode = 400;
            throw error;
        }
    }
    catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

module.exports = { userProfile, updateProfile }