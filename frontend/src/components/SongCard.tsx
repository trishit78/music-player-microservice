import { FaBookmark, FaPlay } from "react-icons/fa";

import fallbackImg from "../../public/photo.jpeg";
import { useUserData } from "../context/UserContext";
//import { useUserData } from "../context/UserContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { addToPlaylist, user } = useUserData();

  const saveToPlayListHandler = () => {
    addToPlaylist(id);
    
  };

  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
      <div className="relative group">
        <img
          src={image ? image : fallbackImg}
          alt={name}
          className="mr-1 w-[160px] rounded"
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
            <button className="bg-green-500 text-black p-2 rounded-full hover:bg-green-400 transition-colors duration-300"><FaPlay/></button>
            <button className="bg-green-500 text-black p-2 rounded-full hover:bg-green-400 transition-colors duration-300"
            onClick={saveToPlayListHandler}
            ><FaBookmark/></button>
        </div>
      </div>

      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc.slice(0, 20)}....</p>
    </div>
  );
};

export default SongCard;
