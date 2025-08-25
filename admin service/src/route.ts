import express from 'express';
import { isAuth } from './middlware.js';
import { addAlbum, addSong, addThumbnail, deleteAlbum, deleteSong } from './controller.js';
import uploadFile  from './uploadFile.js';


const router = express.Router();
router.post('/album/new',isAuth,uploadFile,addAlbum); 
router.post('/song/new',isAuth,uploadFile,addSong); 
router.post('/song/:id',isAuth,uploadFile,addThumbnail); 
router.delete('/album/:id',isAuth,deleteAlbum); 
router.delete('/song/:id',isAuth,deleteSong); 

export default router;