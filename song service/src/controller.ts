import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import { redisClient } from "./index.js";
export const getAllAlbum = TryCatch(async (req, res) => {
  let albums;

  const CACHE_EXPIRY = 1800; // Cache duration in seconds (30 minutes)
  if (redisClient.isReady) {
    albums = await redisClient.get("albums");
  }
  if (albums) {
    console.log("Cache hit");
    res.json(JSON.parse(albums));
    return;
  } else {
    console.log("Cache miss");
    albums = await sql`SELECT * FROM albums`;
   

    if(redisClient.isReady){
      await redisClient.set("albums", JSON.stringify(albums),{
        EX: CACHE_EXPIRY,
      });
    }

     res.json(albums);
     return;
  }
});

export const getAllSongs = TryCatch(async (req, res) => {
  let songs;
    const CACHE_EXPIRY = 1800;
    if (redisClient.isReady) {
        songs = await redisClient.get("songs");
        }



    if (songs) {
        console.log("Cache hit");
        res.json(JSON.parse(songs));
        return;
    }else{
    console.log("Cache miss");
  songs = await sql`SELECT * FROM songs`;
  
    if(redisClient.isReady){
      await redisClient.set("songs", JSON.stringify(songs),{
        EX: CACHE_EXPIRY,
      });
    }

  res.json(songs);
  return;
    }
});

export const getSongsByAlbum = TryCatch(async (req, res) => {
  const { id } = req.params;
  let songs, album;
  const CACHE_EXPIRY = 1800;

    if(redisClient.isReady){
      const cachedData = await redisClient.get(`album:${id}`);
      if(cachedData){
        console.log("Cache hit");
        res.json(JSON.parse(cachedData));
        return; 
      }
    }


  album = await sql`SELECT * FROM albums WHERE id = ${req.params.id}`;

  if (album.length === 0) {
    return res.status(404).json({ message: "Album not found" });
}

songs = await sql`SELECT * FROM songs WHERE album_id = ${req.params.id}`;
const response = { album: album[0], songs };

    if(redisClient.isReady){
      const response = { album: album[0], songs };
      await redisClient.set(`album:${id}`, JSON.stringify(response),{
        EX: CACHE_EXPIRY   ,
      });
    }

    console.log("Cache miss");


  return res.json(response);
});

export const getSingleSong = TryCatch(async (req, res) => {
  //const { songId } = req.params;
  let song;

  const CACHE_EXPIRY = 1800; 

  song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

  if (song.length === 0) {
    return res.status(404).json({ message: "Song not found" });
  }

  res.json(song[0]);
});
