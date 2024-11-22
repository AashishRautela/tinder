const express=require("express");
const { userAuth } = require("../middlewares/auth");
const { getFullName } = require("../utils/common");
const router=express.Router();
const {sendConnectionRequest,reviewConnectionRequest}=require("../controllers/requestController")


router.post("/send/:status/:userID",userAuth,sendConnectionRequest)
router.patch("/review/:status/:requestID",userAuth,reviewConnectionRequest)

module.exports=router;