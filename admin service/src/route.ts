import express from 'express';
import { isAuth } from './middlware.js';
import { addAlbum } from './controller.js';
import uploadFile  from './uploadFile.js';


const router = express.Router();
router.post('/album/new',isAuth,uploadFile,addAlbum); 

export default router;