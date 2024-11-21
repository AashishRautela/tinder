const express=require("express");
const { userAuth } = require("../middlewares/auth");
const { getFullName } = require("../utils/common");
const router=express.Router();
const {sendConnectionRequest,test}=require("../controllers/requestController")


router.post("/send/:status/:userID",userAuth,sendConnectionRequest)

module.exports=router;