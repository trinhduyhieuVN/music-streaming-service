"use client";

import Image from "next/image";
import { HiOutlinePlus } from "react-icons/hi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";
import { useUser } from "@/hooks/useUser";
import LikeButton from "./LikeButton";

import PlayButton from "./PlayButton";

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({
  data,
  onClick
}) => {
  const imagePath = useLoadImage(data);
  const addToPlaylistModal = useAddToPlaylistModal();
  const { user } = useUser();

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      addToPlaylistModal.onOpen(data.id);
    }
  };

  return ( 
    <div
      onClick={() => onClick(data.id)} 
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-neutral-400/5 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
      "
    >
      <div 
        className="
          relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imagePath || '/images/music-placeholder.png'}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.title}
        </p>
        <p 
          className="
            text-neutral-400 
            text-sm 
            pb-4 
            w-full 
            truncate
          "
        >
          By {data.author}
        </p>
      </div>
      
      {/* Play Button */}
      <div 
        className="
          absolute 
          bottom-24 
          right-5
        "
      >
        <PlayButton />
      </div>

      {/* Action Buttons - Show on Hover */}
      {user && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {/* Add to Playlist Button */}
          <button
            onClick={handleAddToPlaylist}
            className="
              p-2
              rounded-full
              bg-neutral-900/80
              hover:bg-neutral-900
              hover:scale-110
              transition
              text-white
            "
            title="Add to playlist"
          >
            <HiOutlinePlus size={20} />
          </button>

          {/* Like Button */}
          <div className="p-1">
            <LikeButton songId={data.id} />
          </div>
        </div>
      )}
    </div>
   );
}
 
export default SongItem;
