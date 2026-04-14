import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protect=async(req,res,next)=>{
    try{
        let token;
        // Check for token in Authorization header
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Access denied. No token Provided.'
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.userId);
        if(!user){
            return res.status(401).json({
                success:false,
                message:'Invalid token. User not found'
            });
        }
        req.user={id:user._id,name:user.name,email:user.email};
        next();
    }
    catch(error){
        res.status(401).json({
            success:false,
            message:'Invalid token'
        })
    }
}

export default protect;