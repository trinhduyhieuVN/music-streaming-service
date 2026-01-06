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

  // Generate consistent color based on playlist ID if no color is set
  const getPlaylistColor = () => {
    if (data.color) return data.color;
    
    const colors = [
      'from-red-500 to-pink-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-purple-500',
      'from-cyan-500 to-blue-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
    ];
    
    // Use playlist ID to generate consistent color index
    const hash = data.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const playlistColor = getPlaylistColor();

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
      <div className={`relative aspect-square w-full h-full rounded-md overflow-hidden ${!data.cover_url ? `bg-gradient-to-br ${playlistColor}` : ''}`}>
        {data.cover_url ? (
          <Image
            className="object-cover"
            src={data.cover_url}
            fill
            alt={data.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
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
