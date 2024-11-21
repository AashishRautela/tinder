const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is not supported` 
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1})

connectionRequestSchema.pre("save",function(next){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Can not send request to yourself");
    }
    next();
})

module.exports=mongoose.model("ConnectionRequest", connectionRequestSchema)