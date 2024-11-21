const User = require("../models/user");
require("dotenv").config({ path: "config.env" });
const bcrypt = require("bcrypt");
const key = process.env.JWT_KEY;

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

const updateProfile=async (req,res)=>{
    try{
        const user=req.user;
        const notAllowedToUpdate=["emailId","password"];
        let userDataToUpdate=req.body;
        userDataToUpdate=Object.keys(userDataToUpdate)
        const invalidFields=notAllowedToUpdate.filter((field)=>{
            if(userDataToUpdate.includes(field)){
                return field;
            }
        })
        if(invalidFields.length > 0){
            const temp=invalidFields.join(", ")
            const error=new Error(`Following fields are not allowed to update ${temp}`);
            error.statusCode=400;
            throw error;
        }

        let data=await User.findByIdAndUpdate(user?._id,req.body,{new:true,runValidators: true});
        data=data.toObject();
        delete data.password;

        res.status(200).send({
            success:true,
            message:"User updated successfully",
            data:data
        })

    }
    catch(error){
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

const updatePassword=async (req,res)=>{
    try{
        const {password,newPassword,confirmPassword}=req.body;
        const {_id}=req.user
        const isPasswordCorrect=await req.user.validatePassword(password)
        if(!isPasswordCorrect){
            const error=new Error("Password is not correct");
            error.statusCode=400;
            throw error;
        }
        if(newPassword===confirmPassword){
            const encryptedPassword = await bcrypt.hash(newPassword, 10);
            const user=await User.findByIdAndUpdate(_id,{"password":encryptedPassword});
            res.status(200).send({
                success:true,
                message:"Password updated successfully"
            })
        }
        else{
            const error=new Error(`Password do not match`);
            error.statusCode=500;
            throw error;
        }
        }
    catch(error){
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}


//update user profile
// const updateProfile = async (req, res) => {
//     try {
//         const { _id } = req.user;
//         const notAllowed = ["emailId","password"];
//         // const { emailId } = req.body;
//         // if (emailId && req.user.emailId) {
//         //     return res.status(400).send({
//         //         success: false,
//         //         message: `You are not allowed to update the emailId`
//         //     });
//         // }
//         // else if (emailId && !req.user.emailId) {
//         //     const user = await User.find({ emailId: emailId })
//         //     if (user) {
//         //         return res.status(400).send({
//         //             success: false,
//         //             message: `Email already exist`
//         //         });
//         //     }
//         // }
//         const toBeUpdatedFields = Object.keys(req.body);

//         const restrictedFields = toBeUpdatedFields.filter(field => notAllowed.includes(field));
//         if (restrictedFields.length > 0) {
//             return res.status(400).send({
//                 success: false,
//                 message: `You are not allowed to update the following fields: ${restrictedFields.join(", ")}`
//             });
//         }

//         const user = await User.findByIdAndUpdate(_id, req.body, { returnDocument: "after", runValidators: true })
//         const data = user.toObject();
//         delete data.password
//         if (user) {
//             res.status(200).send({
//                 sucess: true,
//                 message: "Profile Updated Successfully",
//                 data: data
//             })
//         }
//         else {
//             const error = new Error("User not found");
//             error.statusCode = 400;
//             throw error;
//         }
//     }
//     catch (error) {
//         res.status(error.statusCode || 500).send({
//             success: false,
//             message: error.message || "Internal Server Error"
//         })
//     }
// }

module.exports = { userProfile, updateProfile ,updatePassword }