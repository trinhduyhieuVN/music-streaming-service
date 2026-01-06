"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiUserCircle } from "react-icons/hi2";

import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import PlayButton from "@/components/PlayButton";
import useOnPlay from "@/hooks/useOnPlay";
import ArtistAvatar from "@/components/ArtistAvatar";

interface ArtistContentProps {
  songs: Song[];
  artistName: string;
}

const ArtistContent: React.FC<ArtistContentProps> = ({
  songs,
  artistName
}) => {
  const router = useRouter();
  const onPlay = useOnPlay(songs);
  const [totalDuration, setTotalDuration] = useState(0);

  // Generate initials for artist
  const initials = useMemo(() => {
    return artistName.trim().toUpperCase().substring(0, 2);
  }, [artistName]);

  useEffect(() => {
    const duration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
    setTotalDuration(duration);
  }, [songs]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const artistImage = songs[0]?.image_path;

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-x-2 text-neutral-400 hover:text-white transition mb-6"
        >
          <HiArrowLeft size={24} />
          <span>Back</span>
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Artist Avatar */}
          <div className="w-56 h-56">
            <ArtistAvatar 
              artistName={artistName}
              initials={initials}
              size="xl"
            />
          </div>

          {/* Artist Info */}
          <div className="flex flex-col gap-y-2 text-center md:text-left">
            <p className="text-sm font-semibold text-neutral-400">Artist</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {artistName}
            </h1>
            <div className="flex items-center gap-x-2 text-sm text-neutral-400">
              <span>{songs.length} song{songs.length > 1 ? 's' : ''}</span>
              {totalDuration > 0 && (
                <>
                  <span>•</span>
                  <span>{formatDuration(totalDuration)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gradient-to-b from-neutral-900/80 to-neutral-900">
        <div className="flex items-center gap-x-4">
          {songs.length > 0 && (
            <button
              onClick={() => onPlay(songs[0].id)}
              className="
                flex items-center justify-center
                bg-green-500
                hover:bg-green-400
                text-black
                rounded-full
                p-4
                hover:scale-105
                transition
              "
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6 pb-6">
        {songs.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">
            <p>No songs found for this artist</p>
          </div>
        ) : (
          <div className="flex flex-col gap-y-1">
            {/* Table Header */}
            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-x-4 px-4 py-2 text-sm text-neutral-400 border-b border-neutral-800">
              <div>#</div>
              <div>Title</div>
              <div className="hidden md:block">Album</div>
              <div className="hidden sm:block text-right">Duration</div>
            </div>

            {/* Songs */}
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="
                  grid grid-cols-[16px_4fr_2fr_1fr] gap-x-4
                  px-4 py-2
                  rounded-md
                  hover:bg-neutral-800/50
                  group
                  transition
                  items-center
                "
              >
                <div className="text-neutral-400 text-sm">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <button
                    onClick={() => onPlay(song.id)}
                    className="hidden group-hover:block"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-x-3 overflow-hidden">
                  <div className="relative min-h-[40px] min-w-[40px] overflow-hidden rounded">
                    <img
                      src={song.image_path || '/images/liked.png'}
                      alt={song.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-white truncate group-hover:text-green-500 transition">
                      {song.title}
                    </p>
                    <p className="text-neutral-400 text-sm truncate">
                      {song.author}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block text-neutral-400 text-sm truncate">
                  {song.album_id || '-'}
                </div>

                <div className="hidden sm:flex items-center justify-end gap-x-4">
                  <LikeButton songId={song.id} />
                  <span className="text-neutral-400 text-sm">
                    {song.duration ? `${Math.floor(song.duration / 60)}:${String(Math.floor(song.duration % 60)).padStart(2, '0')}` : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistContent;
