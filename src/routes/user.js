const express=require("express")
const router=express.Router();
const {userAuth} =require("../middlewares/auth");
const { userConnections ,userRequests } = require("../controllers/userController");

router.get("/connections",userAuth,userConnections);
router.get("/requests",userAuth,userRequests);

module.exports=router;