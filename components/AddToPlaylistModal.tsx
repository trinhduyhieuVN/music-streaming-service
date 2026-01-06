"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import { Playlist } from "@/types";
import { useUser } from "@/hooks/useUser";
import useAddToPlaylistModal from "@/hooks/useAddToPlaylistModal";
import { createPlaylist, addSongToPlaylist } from "@/actions/playlistActions";

const AddToPlaylistModal = () => {
  const router = useRouter();
  const { isOpen, onClose, songId } = useAddToPlaylistModal();
  const { user } = useUser();
  const supabase = createClientComponentClient();
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setPlaylists(data || []);
    };

    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen, user?.id, supabase]);

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!songId) return;
    
    setIsLoading(true);
    const result = await addSongToPlaylist(playlistId, songId);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Added to playlist!");
      router.refresh();
      onClose();
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim() || !songId) return;

    setIsLoading(true);
    
    // Create playlist
    const createResult = await createPlaylist({ name: newPlaylistName.trim() });
    
    if (createResult.error) {
      toast.error(createResult.error);
      setIsLoading(false);
      return;
    }

    // Add song to new playlist
    if (createResult.playlist) {
      const addResult = await addSongToPlaylist(createResult.playlist.id, songId);
      
      if (addResult.error) {
        toast.error(addResult.error);
      } else {
        toast.success(`Created "${newPlaylistName}" and added song!`);
        router.refresh();
        onClose();
      }
    }
    
    setIsLoading(false);
    setNewPlaylistName("");
    setShowCreateNew(false);
  };

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
      setShowCreateNew(false);
      setNewPlaylistName("");
    }
  };

  return (
    <Modal
      title="Add to Playlist"
      description="Choose a playlist or create a new one"
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className="flex flex-col gap-y-4">
        {/* Existing Playlists */}
        {playlists.length > 0 && (
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-neutral-400">Your Playlists</p>
            <div className="max-h-[200px] overflow-y-auto flex flex-col gap-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => !isLoading && handleAddToPlaylist(playlist.id)}
                  className={`
                    flex items-center gap-x-3 p-3 rounded-md
                    bg-neutral-800/50 hover:bg-neutral-800
                    cursor-pointer transition
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center">
                    <TbPlaylist className="text-white" size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white font-medium">{playlist.name}</p>
                    <p className="text-neutral-400 text-sm">
                      {playlist.song_count || 0} songs
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create New Playlist */}
        {showCreateNew ? (
          <div className="flex flex-col gap-y-3 p-4 bg-neutral-800/50 rounded-md">
            <p className="text-sm text-neutral-400">New Playlist Name</p>
            <Input
              placeholder="My Playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex gap-x-3">
              <Button
                onClick={handleCreateAndAdd}
                disabled={isLoading || !newPlaylistName.trim()}
                className="flex-1"
              >
                Create & Add
              </Button>
              <Button
                onClick={() => setShowCreateNew(false)}
                disabled={isLoading}
                className="bg-transparent text-white hover:bg-neutral-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateNew(true)}
            disabled={isLoading}
            className="
              flex items-center gap-x-3 p-3 rounded-md
              bg-neutral-800/50 hover:bg-neutral-800
              cursor-pointer transition text-left
            "
          >
            <div className="w-12 h-12 rounded-md bg-neutral-700 flex items-center justify-center">
              <AiOutlinePlus className="text-white" size={24} />
            </div>
            <p className="text-white font-medium">Create New Playlist</p>
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;
