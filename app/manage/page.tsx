"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { FiEdit2, FiMusic, FiCheck, FiX, FiLock, FiTrash2 } from "react-icons/fi";

import { useUser } from "@/hooks/useUser";
import Header from "@/components/Header";
import useEditSongModal from "@/hooks/useEditSongModal";
import useDeleteSong from "@/hooks/useDeleteSong";
import { GENRE_NAMES } from "@/constants/genres";
import { Song } from "@/types";
import useIsAdmin from "@/hooks/useIsAdmin";

const ManagePage = () => {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const supabaseClient = useSupabaseClient();
  const editSongModal = useEditSongModal();
  const { isAdmin } = useIsAdmin();
  const { deleteSong, isDeleting } = useDeleteSong();
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [bulkGenre, setBulkGenre] = useState("");
  const [filter, setFilter] = useState<"all" | "no-genre">("all");

  // Handle delete song
  const handleDeleteSong = async (song: Song) => {
    if (confirm(`Are you sure you want to delete "${song.title}"? This action cannot be undone.`)) {
      const success = await deleteSong(song.id);
      if (success) {
        setSongs(prev => prev.filter(s => s.id !== song.id));
        setSelectedSongs(prev => prev.filter(id => id !== song.id));
      }
    }
  };

  // Fetch all songs (admin gets all songs, not just their own)
  useEffect(() => {
    const fetchSongs = async () => {
      if (!user || !isAdmin) return;
      
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load songs');
        console.error(error);
      } else {
        setSongs(data || []);
      }
      setLoading(false);
    };

    if (user && isAdmin) {
      fetchSongs();
    }
  }, [user, supabaseClient, isAdmin]);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!userLoading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, userLoading, isAdmin, router]);

  // Show access denied if not admin
  if (!userLoading && user && !isAdmin) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mb-2">
            <h1 className="text-white text-3xl font-semibold flex items-center gap-x-2">
              <FiLock />
              Access Denied
            </h1>
            <p className="text-neutral-400 mt-2">
              You don't have permission to access this page.
              Only administrators can manage songs.
            </p>
          </div>
        </Header>
      </div>
    );
  }

  const filteredSongs = filter === "no-genre" 
    ? songs.filter(song => !song.genre) 
    : songs;

  const toggleSelectSong = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const selectAll = () => {
    if (selectedSongs.length === filteredSongs.length) {
      setSelectedSongs([]);
    } else {
      setSelectedSongs(filteredSongs.map(s => s.id));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedSongs.length === 0) {
      toast.error('Please select at least one song');
      return;
    }
    if (!bulkGenre) {
      toast.error('Please select a genre');
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('songs')
        .update({ genre: bulkGenre })
        .in('id', selectedSongs);

      if (error) {
        toast.error('Failed to update songs');
        return;
      }

      // Update local state
      setSongs(prev => prev.map(song => 
        selectedSongs.includes(song.id) 
          ? { ...song, genre: bulkGenre }
          : song
      ));
      
      toast.success(`Updated ${selectedSongs.length} songs!`);
      setSelectedSongs([]);
      setBulkGenre("");
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleSingleGenreUpdate = async (songId: string, genre: string) => {
    try {
      const { error } = await supabaseClient
        .from('songs')
        .update({ genre })
        .eq('id', songId);

      if (error) {
        toast.error('Failed to update');
        return;
      }

      setSongs(prev => prev.map(song => 
        song.id === songId ? { ...song, genre } : song
      ));
      toast.success('Genre updated!');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (userLoading || loading) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mb-2">
            <h1 className="text-white text-3xl font-semibold">Manage Songs</h1>
          </div>
        </Header>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  const songsWithoutGenre = songs.filter(s => !s.genre).length;

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Manage Songs</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {songs.length} songs total • {songsWithoutGenre} without genre
          </p>
        </div>
      </Header>

      <div className="px-6 pb-6">
        {/* Filter & Bulk Actions */}
        <div className="bg-neutral-800/50 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-sm">Filter:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filter === "all" 
                    ? "bg-green-500 text-black" 
                    : "bg-neutral-700 text-white hover:bg-neutral-600"
                }`}
              >
                All ({songs.length})
              </button>
              <button
                onClick={() => setFilter("no-genre")}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filter === "no-genre" 
                    ? "bg-orange-500 text-black" 
                    : "bg-neutral-700 text-white hover:bg-neutral-600"
                }`}
              >
                No Genre ({songsWithoutGenre})
              </button>
            </div>

            <div className="h-6 w-px bg-neutral-600 hidden sm:block" />

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={selectAll}
                className="px-3 py-1 rounded-full text-sm bg-neutral-700 text-white hover:bg-neutral-600 transition"
              >
                {selectedSongs.length === filteredSongs.length ? "Deselect All" : "Select All"}
              </button>
              
              {selectedSongs.length > 0 && (
                <>
                  <span className="text-green-500 text-sm">
                    {selectedSongs.length} selected
                  </span>
                  <select
                    value={bulkGenre}
                    onChange={(e) => setBulkGenre(e.target.value)}
                    className="bg-neutral-700 text-white text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select genre...</option>
                    {GENRE_NAMES.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkUpdate}
                    disabled={!bulkGenre}
                    className="px-4 py-1 rounded-full text-sm bg-green-500 text-black hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Genre
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Songs List */}
        {filteredSongs.length === 0 ? (
          <div className="text-center py-10">
            <FiMusic className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">
              {filter === "no-genre" 
                ? "All songs have genres! 🎉" 
                : "No songs found. Upload some music!"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-neutral-400 text-sm border-b border-neutral-700">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedSongs.length === filteredSongs.length && filteredSongs.length > 0}
                  onChange={selectAll}
                  className="w-4 h-4 accent-green-500"
                />
              </div>
              <div className="col-span-4">Title</div>
              <div className="col-span-3">Artist</div>
              <div className="col-span-3">Genre</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Song Rows */}
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg transition ${
                  selectedSongs.includes(song.id)
                    ? "bg-neutral-700/50"
                    : "hover:bg-neutral-800/50"
                }`}
              >
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => toggleSelectSong(song.id)}
                    className="w-4 h-4 accent-green-500"
                  />
                </div>
                <div className="col-span-4 flex items-center">
                  <p className="text-white truncate">{song.title}</p>
                </div>
                <div className="col-span-3 flex items-center">
                  <p className="text-neutral-400 truncate">{song.author}</p>
                </div>
                <div className="col-span-3 flex items-center">
                  <select
                    value={song.genre || ""}
                    onChange={(e) => handleSingleGenreUpdate(song.id, e.target.value)}
                    className={`bg-neutral-700 text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-green-500 w-full max-w-[150px] ${
                      song.genre ? "text-white" : "text-orange-400"
                    }`}
                  >
                    <option value="">No genre</option>
                    {GENRE_NAMES.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 flex items-center gap-1">
                  <button
                    onClick={() => editSongModal.onOpen(song)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-full transition"
                    title="Edit song"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song)}
                    disabled={isDeleting}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-600/20 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete song"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePage;
