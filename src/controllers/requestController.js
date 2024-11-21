const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user")
module.exports.sendConnectionRequest = async (req, res) => {
    try {
        const { _id } = req.user;
        const toUserId = req.params.userID;
        console.log('toUserId', toUserId)
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).send({
                success: false,
                message: "Status type is not valid"
            })
        }
        else if (!_id || !toUserId || !status) {
            return res.status(400).send({
                success: false,
                message: "Request Data Missing"
            })
        }

        //check if user exists in db or not
        const user=await User.findById(toUserId);
        if(!user){
            return res.status(400).send({
                success: false,
                message: "User not found"
            })
        }
        
        //check if the request already exists
        const existingConnectionRequest = await ConnectionRequest.findOne(
            {
                $or: [
                    { "fromUserId": toUserId, "toUserId": _id },
                    { "fromUserId": _id, "toUserId": toUserId }
                ]
            }
        );
        if (existingConnectionRequest) {
            return res.status(400).send({
                success: false,
                message: "Requst already exists"
            })
        }
        //create the connection request
        const obj = {
            fromUserId: _id,
            toUserId: toUserId,
            status: status,
        }
        const request = new ConnectionRequest(obj);
        await request.save();
        res.status(200).send({
            success: false,
            message: "Request sent successfully"
        })

    }
    catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}