const express=require("express")
const router=express.Router();
const {userAuth} =require("../middlewares/auth");
const { userConnections ,userRequests,userFeed } = require("../controllers/userController");

router.get("/connections",userAuth,userConnections);
router.get("/requests",userAuth,userRequests);
router.get("/feed",userAuth,userFeed)

module.exports=router;