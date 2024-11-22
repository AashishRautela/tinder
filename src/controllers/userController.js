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

//get user feed
module.exports.userFeed = async (req, res) => {
    try {
        const user = req.user;

        // Parse and validate pagination parameters
        const page = parseInt(req.params.page) || 1; // Default to page 1
        const limit = parseInt(req.params.limit) || 10; // Default to 10 items per page
        if (page < 1 || limit < 1) {
            return res.status(400).send({
                success: false,
                message: "Invalid pagination parameters. 'page' and 'limit' must be positive integers.",
            });
        }

        // Fetch connection requests involving the current user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: user?._id },
                { toUserId: user?._id },
            ],
        }).select("fromUserId toUserId");

        // Create a Set of user IDs to exclude
        const excludedUserIds = new Set();
        connectionRequests.forEach((request) => {
            excludedUserIds.add(request?.fromUserId.toString());
            excludedUserIds.add(request?.toUserId.toString());
        });

        // Add the current user to the exclusion list
        excludedUserIds.add(user?._id.toString());

        // Fetch users not in the exclusion list with pagination
        const users = await User.find({
            _id: { $nin: Array.from(excludedUserIds) },
        })
            .select("firstName lastName age gender skills")
            .skip((page - 1) * limit) // Skip based on page and limit
            .limit(limit);

        res.status(200).send({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

