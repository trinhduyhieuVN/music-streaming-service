"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaMusic } from "react-icons/fa";

import { Song } from "@/types";
import useEditSongModal from "@/hooks/useEditSongModal";
import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";

interface SongItemProps {
  song: Song;
  onDelete: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ song, onDelete }) => {
  const editSongModal = useEditSongModal();
  const imageUrl = useLoadImage(song);

  return (
    <div className="
      flex 
      items-center 
      gap-x-4 
      w-full 
      p-3 
      rounded-md 
      bg-neutral-800/50
      hover:bg-neutral-800
      transition
    ">
      {/* Image */}
      <div className="
        relative 
        rounded-md 
        min-h-[56px] 
        min-w-[56px] 
        overflow-hidden
      ">
        <Image
          fill
          src={imageUrl || '/images/liked.png'}
          alt={song.title}
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <p className="text-white font-medium truncate">
          {song.title}
        </p>
        <p className="text-neutral-400 text-sm truncate">
          {song.author}
        </p>
        <div className="flex items-center gap-x-2 mt-1">
          {song.genre ? (
            <span className="
              text-xs 
              px-2 
              py-0.5 
              rounded-full 
              bg-green-500/20 
              text-green-400
              border
              border-green-500/30
            ">
              {song.genre}
            </span>
          ) : (
            <span className="
              text-xs 
              px-2 
              py-0.5 
              rounded-full 
              bg-yellow-500/20 
              text-yellow-400
              border
              border-yellow-500/30
            ">
              No genre
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => editSongModal.onOpen(song)}
          className="
            p-2
            rounded-full
            bg-neutral-700
            hover:bg-green-500
            transition
            text-white
          "
          title="Edit song"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => onDelete(song.id)}
          className="
            p-2
            rounded-full
            bg-neutral-700
            hover:bg-red-500
            transition
            text-white
          "
          title="Delete song"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

interface MySongsContentProps {
  songs: Song[];
}

const MySongsContent: React.FC<MySongsContentProps> = ({ songs }) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [localSongs, setLocalSongs] = useState<Song[]>(songs);
  const [filter, setFilter] = useState<'all' | 'with-genre' | 'no-genre'>('all');

  useEffect(() => {
    setLocalSongs(songs);
  }, [songs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) {
      return;
    }

    const { error } = await supabaseClient
      .from('songs')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete song');
      return;
    }

    setLocalSongs(prev => prev.filter(s => s.id !== id));
    toast.success('Song deleted');
    router.refresh();
  };

  // Lọc bài hát
  const filteredSongs = localSongs.filter(song => {
    if (filter === 'all') return true;
    if (filter === 'with-genre') return !!song.genre;
    if (filter === 'no-genre') return !song.genre;
    return true;
  });

  const songsWithoutGenre = localSongs.filter(s => !s.genre).length;

  if (localSongs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <FaMusic size={48} className="text-neutral-400 mb-4" />
        <p className="text-neutral-400">You haven't uploaded any songs yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Stats */}
      <div className="flex items-center gap-x-4 flex-wrap">
        <div className="
          px-4 
          py-2 
          rounded-lg 
          bg-neutral-800
          text-white
        ">
          <span className="text-neutral-400 text-sm">Total: </span>
          <span className="font-bold">{localSongs.length}</span>
        </div>
        {songsWithoutGenre > 0 && (
          <div className="
            px-4 
            py-2 
            rounded-lg 
            bg-yellow-500/20
            border
            border-yellow-500/30
            text-yellow-400
          ">
            <span className="text-sm">Without genre: </span>
            <span className="font-bold">{songsWithoutGenre}</span>
          </div>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            transition
            ${filter === 'all' 
              ? 'bg-white text-black' 
              : 'bg-neutral-700 text-white hover:bg-neutral-600'
            }
          `}
        >
          All
        </button>
        <button
          onClick={() => setFilter('with-genre')}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            transition
            ${filter === 'with-genre' 
              ? 'bg-green-500 text-black' 
              : 'bg-neutral-700 text-white hover:bg-neutral-600'
            }
          `}
        >
          With genre
        </button>
        <button
          onClick={() => setFilter('no-genre')}
          className={`
            px-4 
            py-2 
            rounded-full 
            text-sm 
            transition
            ${filter === 'no-genre' 
              ? 'bg-yellow-500 text-black' 
              : 'bg-neutral-700 text-white hover:bg-neutral-600'
            }
          `}
        >
          No genre
        </button>
      </div>

      {/* Song list */}
      <div className="flex flex-col gap-y-2">
        {filteredSongs.map((song) => (
          <SongItem 
            key={song.id} 
            song={song} 
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <p className="text-neutral-400 text-center py-4">
          No songs match this filter
        </p>
      )}
    </div>
  );
};

export default MySongsContent;
