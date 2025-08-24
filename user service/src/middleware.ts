import type { NextFunction, Request, Response } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type IUser } from "./model.js";




export interface AuthRequest extends Request {
    user?: IUser |null;     
}



export const isAuth=async (req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
    
    
    try{
        const token = req.headers["token"] as string;

   
    if(!token){
        res.status(401).json({
            success: false,
            message: "No token provided"
        })
        return;
    }
    console.log(process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decoded || !decoded.id){
            res.status(401).json({
                success: false,
                message: "Invalid token"
            })
            return;
        }

        const userId = decoded.id;
        const user= await User.findById(userId).select("-password");
        if(!user){
            res.status(401).json({
                success: false,
                message: "User not found"
            })
            return;
        }

        req.user = user;
        next();
    }catch(err){
        res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}
