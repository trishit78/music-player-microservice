import type { NextFunction, Request, Response } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type IUser } from "./model.js";




export interface AuthRequest extends Request {
    user?: IUser |null;     
}



export const isAuth=async (req:AuthRequest,res:Response,next:NextFunction):Promise<void>=>{
    
    
    try{
    const token = req.headers.token as string;
    if(!token){
        res.status(401).json({
            success: false,
            message: "No token provided"
        })
        return;
    }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decoded || !decoded._id){
            res.status(401).json({
                success: false,
                message: "Invalid token"
            })
            return;
        }

        const userId = decoded._id;
        const user= await User.findById(userId).select("-password");
        if(!user){
            res.status(401).json({
                success: false,
                message: "User not found"
            })
            return;
        }

        req.user = decoded.id;
        next();
    }catch(err){
        res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}

export const myProfile=async (req:AuthRequest,res:Response):Promise<void>=>{
    const userId = req.user;
 
 res.json(userId)
}