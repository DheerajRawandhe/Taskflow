import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
export const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`\n Mongodb connected !! DB HOST :${connectionInstance.connection.host}`);
    } catch (error) {
       console.log("Mongodb connnection error",error);
       process.exit(1); 
    }
}
