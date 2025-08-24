import type { Request } from "express";
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";

import { v2 as cloudinary } from "cloudinary";
import { sql } from "./config/db.js";

interface AuthRequest extends Request {
    user?: {    
        _id: string;
        role: string;
    } 
}


export const addAlbum = TryCatch(async (req:AuthRequest, res) => {
   if(req.user?.role !== "admin"){
    res.status(403).json({
        success: false,
        message: "Forbidden, you are not admin"
    });
    return;
   }

   const {title, descriptions} = req.body;
   const file = req.file;
   if(!file){
    res.status(400).json({
        success: false,
        message: "File is required"
    });
    return;
   }

   const fileBuffer = getBuffer(file);
   if(!fileBuffer || !fileBuffer.content){
    res.status(500).json({
        success: false,
        message: "failed to generate file buffer"
    });
    return;
   }

   const cloud = await cloudinary.uploader.upload(fileBuffer.content,{ folder: "album" });
   
   const result = await sql`
   INSERT INTO albums (title, descriptions, thumbnail)  
    VALUES (${title}, ${descriptions}, ${cloud.secure_url}) RETURNING *;
    `;
    res.json({
        message: "Album added successfully",
        album: result[0],   
        success: true
    });


    
});