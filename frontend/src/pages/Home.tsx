import Layout from "../components/Layout"
import { useSongData } from "../context/SongContext"
import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";
import Loading from "../components/Loading";
const Home = () => {
  const {albums,songs,loading} = useSongData();

  return (
    <div>
      {
        loading ? (
          <Loading/>
        ):(
        <Layout>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            <div className="flex overflow-auto">
              {
                albums?.map((e,index)=>{
                 return <AlbumCard  key={index} image = {e.thumbnail} name={e.title} desc={e.descriptions} id={e.id}   />
                })
              }
            </div>
          </div>

          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Todays Hits</h1>
            <div className="flex overflow-auto">
              {
                songs?.map((e,index)=>{
                 return <SongCard  key={index} image = {e.thumbnail} name={e.title} desc={e.descriptions} id={e.id}   />
                })
              }
            </div>
          </div>
        </Layout>
  )}
  </div>
  )
}

export default Home