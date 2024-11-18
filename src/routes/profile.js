const express=require("express");
const { userAuth } = require("../middlewares/auth");
const router=express.Router();
const {userProfile,updateProfile}=require("../controllers/profileController")

router.get("/",userAuth, userProfile);
router.patch("/edit",userAuth,updateProfile)

module.exports=router;