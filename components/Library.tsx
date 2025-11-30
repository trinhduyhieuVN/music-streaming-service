"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { BiLibrary } from "react-icons/bi";

import { Song, Playlist } from "@/types";
import useUploadModal from "@/hooks/useUploadModal";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useOnPlay from "@/hooks/useOnPlay";

import MediaItem from "./MediaItem";
import PlaylistItem from "./PlaylistItem";

interface LibraryProps {
  songs: Song[];
  playlists?: Playlist[];
}

const Library: React.FC<LibraryProps> = ({
  songs,
  playlists = []
}) => {
  const { user } = useUser();
  const uploadModal = useUploadModal();
  const playlistModal = usePlaylistModal();
  const authModal = useAuthModal();

  const onPlay = useOnPlay(songs);

  const onClickUpload = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return uploadModal.onOpen();
  }

  const onClickPlaylist = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return playlistModal.onOpen();
  }

  return ( 
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <BiLibrary className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">
            Your Library
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <AiOutlinePlus 
            onClick={onClickUpload} 
            size={20} 
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            title="Upload song"
          />
        </div>
      </div>

      {/* Playlists Section */}
      {playlists.length > 0 && (
        <div className="flex flex-col gap-y-2 mt-4 px-3">
          <div className="flex items-center justify-between">
            <p className="text-neutral-400 text-sm font-medium">Playlists</p>
            <AiOutlinePlus 
              onClick={onClickPlaylist} 
              size={16} 
              className="text-neutral-400 cursor-pointer hover:text-white transition"
              title="Create playlist"
            />
          </div>
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              onClick={() => window.location.href = `/playlist/${playlist.id}`}
              className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 p-2 rounded-md"
            >
              <div className="relative min-h-[48px] min-w-[48px] rounded-md overflow-hidden bg-gradient-to-br from-purple-700 to-blue-300">
                <TbPlaylist className="absolute inset-0 m-auto text-white" size={20} />
              </div>
              <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate">{playlist.name}</p>
                <p className="text-neutral-400 text-sm truncate">
                  Playlist • {playlist.song_count || 0} songs
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Songs Section */}
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        <p className="text-neutral-400 text-sm font-medium">Songs</p>
        {songs.map((item) => (
          <MediaItem 
            onClick={(id: string) => onPlay(id)} 
            key={item.id} 
            data={item}
          />
        ))}
      </div>
    </div>
   );
}
 
export default Library;