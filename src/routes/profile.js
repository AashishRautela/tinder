const express=require("express");
const { userAuth } = require("../middlewares/auth");
const router=express.Router();
const {userProfile,updateProfile,updatePassword}=require("../controllers/profileController")

router.get("/",userAuth, userProfile);
router.patch("/edit",userAuth,updateProfile)
router.patch("/updatePassword",userAuth,updatePassword)

module.exports=router;