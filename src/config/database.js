const mongoose =require("mongoose");

const connectDb=async ()=>{
    await mongoose.connect(
        "mongodb+srv://asisrautela612:8yKtpf6K3vUx446U@cluster0.rzce3.mongodb.net/devTinder"
    )
}

module.exports=connectDb;

