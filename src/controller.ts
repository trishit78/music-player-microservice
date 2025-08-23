import type { Request, Response } from "express";
import TryCatch from "./TryCatch.js";
import { User } from "./model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const registerUser = TryCatch(async (req: Request, res: Response) => {
   const {name, email, password} = req.body;
   const user = await User.findOne({email});
   if(user){
    return res.status(400).json({
        success: false,
        message: "User already exists"
    })
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = await User.create({name, email, password: hashedPassword});
   const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET as string, {expiresIn: "7d"});
   res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: newUser,
    token
   })
})