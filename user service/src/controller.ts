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


// export const addToPlaylist = TryCatch(async(req:AuthRequest,res)=>{
    
//     const user = await User.findById(userId);
//     if(!user){
    //         res.status(404).json({
        //             message:"No user with this id"
        //         })
        //         return;
        //     }
        
        //     const songId = req.params.id;
//     if(!songId){
    //         res.status(400).json({
//             message:"Song id is required"
//         })
//         return;
//     }

//     if(user?.playlist.includes(songId)){
    //         const index = user.playlist.indexOf(songId);
    //         user.playlist.splice(index,1);
    
    //         await user.save();
    
    //         res.json({
        //             message:"Removed from playlist"
        //         })
        //         return;
        //     }
        //     user.playlist.push(songId);
        
        //     await user.save();
        
        //     res.json({
            //         message:"Added to playlist"
            //     })
            // })
            
            // const userId = req.user?._id;


export const addToPlaylist = TryCatch(async (req: AuthRequest, res) => {
    const { songId } = req.body;
    const userId = req.user?._id;
  
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
      return;
    }
  
    if (!songId) {
      res.status(400).json({
        success: false,
        message: "Song ID is required"
      });
      return;
    }
  
    try {
      // Check if song is already in playlist
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found"
        });
        return;
      }
  
      let updatedUser;
      let message;
  
      if (user.playlist.includes(songId)) {
        // Song exists, remove it from playlist
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { playlist: songId } },
          { new: true }
        ).select("-password");
        message = "Song removed from playlist";
      } else {
        // Song doesn't exist, add it to playlist
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $push: { playlist: songId } },
          { new: true }
        ).select("-password");
        message = "Song added to playlist";
      }
  
      res.status(200).json({
        success: true,
        message: message,
        user: updatedUser,
        isInPlaylist: !user.playlist.includes(songId) // Return new state
      });
    } catch (error) {
      console.error("Toggle playlist error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });
  