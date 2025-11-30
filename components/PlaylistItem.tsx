"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

import { Playlist } from "@/types";

interface PlaylistItemProps {
  data: Playlist;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/playlist/${data.id}`);
  };

  return (
    <div
      onClick={handleClick}
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
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        <Image
          className="object-cover"
          src={data.cover_url || '/images/playlist-placeholder.png'}
          fill
          alt={data.name}
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.name}
        </p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          {data.song_count || 0} songs
        </p>
      </div>
      <div 
        className="
          absolute 
          bottom-24 
          right-5
          opacity-0
          group-hover:opacity-100
          transition
        "
      >
        <button
          className="
            flex
            items-center
            justify-center
            rounded-full
            bg-green-500
            p-4
            drop-shadow-md
            hover:scale-110
            transition
          "
        >
          <FaPlay className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default PlaylistItem;
