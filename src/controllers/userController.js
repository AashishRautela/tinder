const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//get all the user connections
module.exports.userConnections = async (req, res) => {
    try {
        const user = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: user?._id, status: "accepted" },
                { toUserId: user?._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", ["firstName", "lastName", "gender", "age"])
        .populate("toUserId", ["firstName", "lastName", "gender", "age"])

        const data=connectionRequests.map((data)=>{
            if(data?.fromUserId._id.toString()===user?._id.toString()){
                return data?.toUserId
            }
            else{
                return data?.fromUserId
            }
        })
        res.status(200).send({
            success: true,
            data: data || []
        })
    }
    catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

//get all the connection request for the user
module.exports.userRequests = async (req, res) => {
    try {
        const user = req.user;
        const connectionRequests = await ConnectionRequest.find(
            { toUserId: user?._id, status: "interested" }
        ).populate("fromUserId", ["firstName", "lastName", "gender", "age"]);
        res.status(200).send({
            success: true,
            data: connectionRequests || []
        })
    }
    catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}