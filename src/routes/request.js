const express=require("express");
const { userAuth } = require("../middlewares/auth");
const { getFullName } = require("../utils/common");
const router=express.Router();

router.post("send/interested/:userID",userAuth,(req,res)=>{
    try{
        const user=req.user
        res.send(getFullName(user) + " sent the request")
    }
    catch(error){
        req.status(error.statusCode || 400).send({
            sucess:false,
            message:error.message
        })
    }
})

module.exports=router;