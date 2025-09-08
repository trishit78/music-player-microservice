import  { useEffect, useState } from 'react'
import { useSongData, type Song } from '../context/SongContext';
import { useUserData } from '../context/UserContext';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import { FaBookmark, FaPlay } from 'react-icons/fa';
import fallback from "../../public/photo.jpeg";
const Playlist = () => {
    const {
        
        setIsPlaying,
        setSelectedSong,
        loading,
        songs
      } = useSongData();

      const {user} = useUserData();
      const [myPlaylist,setMyPlaylist] = useState<Song[]>([]);

      useEffect(()=>{
        if(songs && user?.playlist){
            const filteredSongs = songs.filter((song)=>
                user.playlist.includes(song.id.toString())
            )
            setMyPlaylist(filteredSongs);
        }
      },[songs,user])


  return (
    <div>
      <Layout>
        {myPlaylist && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="mt-10 flex gap-8 flex-col md:flex-row  md:items-center">
                  
                    <img
                      src={'https://images.unsplash.com/photo-1497316730643-415fac54a2af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                      className="w-48 rounded"
                      alt=""
                    />
                 

                  <div className="flex flex-col">
                    <p>Playlist</p>
                    <h2 className="text-3xl font-bold mb-4 md:text5xl">
                      {user?.name} Playlist
                    </h2>
                    <h4>"Your Favourite songs"</h4>
                    <p className="mt-1">
                      <img
                        src="/logo.png"
                        className="inline-block w-6"
                        alt=""
                      />
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                  <p>
                    <b className="mr-4">#</b>
                  </p>
                  <p className="hidden sm:block">Description</p>
                  <p className="text-center">Actions</p>
                </div>
                <hr />
                {songs &&
                  myPlaylist.map((song, index) => {
                    return (
                      <div
                        className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
                        key={index}
                      >
                        <p className="text-white">
                          <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                          <img
                            src={song.thumbnail ? song.thumbnail : fallback}
                            alt=""
                            className="inline w-10 mr-5 "
                          />{" "}
                          {song.title}
                        </p>
                        <p className="text-[15px] hidden sm:block">
                          {song.descriptions.slice(0, 30)}....
                        </p>
                        <p className="flex justify-center items-center ">
                         
                            <button className="text-[15px] text-center"
                           
                            >
                              <FaBookmark />
                            </button>
                         
                        </p>
                        <p className="flex justify-center items-center gap-5">
                          <button
                            className="text-[15px] text-center"
                            onClick={() => {
                              setSelectedSong(song.id);
                              setIsPlaying(true);
                            }}
                          >
                            <FaPlay />
                          </button>
                        </p>
                      </div>
                    );
                  })}
              </>
            )}
          </>
        )}
      </Layout>
    </div>
  )
}

export default Playlist
