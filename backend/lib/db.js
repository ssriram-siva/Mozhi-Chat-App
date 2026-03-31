import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async (req,res)=>{

    try{

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);


    }

    catch(err){
        console.log("MongoDB Connection Error :",err);
    }
    
}