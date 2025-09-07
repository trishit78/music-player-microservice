import type { Request, Response } from "express";
import TryCatch from "./TryCatch.js";
import { User } from "./model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { AuthRequest } from "./middleware.js";


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

export const loginUser = TryCatch(async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(404).json({
            message:"User not exists",
        })
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(400).json({
            message:"Invalid credentials",
        })
        return;
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: "7d"});
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
        token
    })
})

export const myProfile = TryCatch(async (req: AuthRequest, res) => {
  const user = req.user;

  res.json(user);
});


export const addToPlaylist = TryCatch(async(req:AuthRequest,res)=>{
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if(!user){
        res.status(404).json({
            message:"No user with this id"
        })
        return;
    }

    const songId = req.params.id;
    if(!songId){
        res.status(400).json({
            message:"Song id is required"
        })
        return;
    }

    if(user?.playlist.includes(songId)){
        const index = user.playlist.indexOf(songId);
        user.playlist.splice(index,1);

        await user.save();

        res.json({
            message:"Removed from playlist"
        })
        return;
    }
    user.playlist.push(songId);

    await user.save();

    res.json({
        message:"Added to playlist"
    })
})

