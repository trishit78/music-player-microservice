import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";

export const getAllAlbum = TryCatch(async (req, res) => {
  let albums;
  albums = await sql`SELECT * FROM albums`;
    res.json(albums);
});



export const getAllSongs = TryCatch(async (req, res) => {
  let songs;
  songs = await sql`SELECT * FROM songs`;
    res.json(songs);
});

export const getSongsByAlbum = TryCatch(async (req, res) => {
//  const { albumId } = req.params;
  let songs,album;
    album = await sql`SELECT * FROM albums WHERE id = ${req.params.id}`;

    if (album.length === 0) {
      return res.status(404).json({ message: "Album not found" });
    }


  songs = await sql`SELECT * FROM songs WHERE album_id = ${req.params.id}`;

    const response = { album: album[0], songs };
    return res.json(response);

});

export const getSingleSong = TryCatch(async (req, res) => {
  //const { songId } = req.params;
  let song;
    song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

    if (song.length === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(song[0]);
});