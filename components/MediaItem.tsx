"use client";

import Image from "next/image";
import { HiOutlinePlus } from "react-icons/hi";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";
import { useUser } from "@/hooks/useUser";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
  showAddToPlaylist?: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
  showAddToPlaylist = true
}) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(data);
  const addToPlaylistModal = useAddToPlaylistModal();
  const { user } = useUser();

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  
    return player.setId(data.id);
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      addToPlaylistModal.onOpen(data.id);
    }
  };

  return ( 
    <div
      onClick={handleClick}
      className="
        group
        flex 
        items-center 
        gap-x-3 
        cursor-pointer 
        hover:bg-neutral-800/50 
        w-full 
        p-2 
        rounded-md
      "
    >
      <div 
        className="
          relative 
          rounded-md 
          min-h-[48px] 
          min-w-[48px] 
          overflow-hidden
        "
      >
        <Image
          fill
          src={imageUrl || "/images/music-placeholder.png"}
          alt="MediaItem"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden flex-1">
        <p className="text-white truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">
          By {data.author}
        </p>
      </div>
      {showAddToPlaylist && user && (
        <button
          onClick={handleAddToPlaylist}
          className="
            opacity-0
            group-hover:opacity-100
            transition
            p-2
            rounded-full
            hover:bg-neutral-700
            text-neutral-400
            hover:text-white
          "
          title="Add to playlist"
        >
          <HiOutlinePlus size={20} />
        </button>
      )}
    </div>
  );
}
 
export default MediaItem;
