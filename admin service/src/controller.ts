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



export const addSong = TryCatch(async (req:AuthRequest, res) => {
    console.log("this is add song route");


    if(req.user?.role !== "admin"){
     res.status(403).json({
         success: false,
         message: "Forbidden, you are not admin"
     });
     return;
    }
 
    const {title, descriptions, album} = req.body;

    const albumId = Number(album);
const isAlbum = await sql`SELECT id FROM albums WHERE id = ${albumId}`;

    // const isAlbum = await sql `SELECT id FROM albums WHERE id = ${album}`;
    if(isAlbum.length === 0){
     res.status(400).json({
            success: false,
            message: "Album not found"
        });
        return;
    }

    console.log("The req file is",req.file)
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
 
    const cloud = await cloudinary.uploader.upload(fileBuffer.content,{ folder: "songs",resource_type:"video" });
    
    const result = await sql`
    INSERT INTO songs (title, descriptions, audio, album_id)  
     VALUES (${title}, ${descriptions}, ${cloud.secure_url}, ${album}) RETURNING *;
     `;


     res.json({
         message: "Song added successfully",
         song: result[0],   
         success: true
     });
 
 });


 export const addThumbnail = TryCatch(async (req:AuthRequest, res) => {
    if(req.user?.role !== "admin"){
     res.status(403).json({
         success: false,
         message: "Forbidden, you are not admin"
     });
     return;
    }
   const song = await sql`SELECT id FROM songs WHERE id = ${Number(req.params.id)}`;


   if(song.length === 0){
        res.status(400).json({
                success: false,
                message: "Song not found"
            });
            return;
    }
    const file = req.file;
    if(!file){
     res.status(400).json({
         success: false,
         message: "File is required"
     });
     return;
    }
 
    const fileBuffer = getBuffer(file);          // logic to convert file to buffer
    if(!fileBuffer || !fileBuffer.content){
     res.status(500).json({
         success: false,
         message: "failed to generate file buffer"
     });
     return;
    }                            //logic to upload file to cloudinary
    const cloud = await cloudinary.uploader.upload(fileBuffer.content,{ folder: "songs",resource_type:"image" });
    
    const result = await sql`
    UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *;
     `;
     res.json({
         message: "Thumbnail added successfully",
         song: result[0],   
         success: true
     });
 
     
 });

 export const deleteAlbum = TryCatch(async (req:AuthRequest, res) => {
    if(req.user?.role !== "admin"){
     res.status(403).json({
         success: false,
         message: "Forbidden, you are not admin"
     });
     return;
    }
 const isAlbum = await sql`SELECT * FROM albums WHERE id = ${Number(req.params.id)}`;
    if(isAlbum.length === 0){
     res.status(400).json({ 
            success: false,
            message: "Album not found"
        });
        return;
    };


    await sql`DELETE FROM songs WHERE album_id = ${Number(req.params.id)}`;

    await sql`DELETE FROM albums WHERE id = ${Number(req.params.id)}`;
    
    res.json({
        success: true,
        message: "Album deleted successfully"
    });
    
 });


 export const deleteSong = TryCatch(async (req:AuthRequest, res) => {
    if(req.user?.role !== "admin"){
     res.status(403).json({
         success: false,
         message: "Forbidden, you are not admin"
     });
     return;
    }       

 const isSong = await sql`SELECT * FROM albums WHERE id = ${Number(req.params.id)}`;
    if(isSong.length === 0){
     res.status(400).json({ 
            success: false,
            message: "song not found"
        });
        return;
    };

    await sql`DELETE FROM songs WHERE id = ${Number(req.params.id)}`;
    res.json({
        success: true,
        message: "Song deleted successfully"
        
    });
});

