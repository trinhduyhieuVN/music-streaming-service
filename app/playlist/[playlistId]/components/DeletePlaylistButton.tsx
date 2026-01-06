"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";

interface DeletePlaylistButtonProps {
  playlistId: string;
  userId: string;
}

const DeletePlaylistButton: React.FC<DeletePlaylistButtonProps> = ({ 
  playlistId,
  userId 
}) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    if (user.id !== userId) {
      toast.error('You can only delete your own playlists');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this playlist? This action cannot be undone.');
    
    if (!confirmed) return;

    try {
      setIsDeleting(true);

      // First delete all playlist_songs entries
      const { error: playlistSongsError } = await supabaseClient
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId);

      if (playlistSongsError) {
        throw playlistSongsError;
      }

      // Then delete the playlist
      const { error: playlistError } = await supabaseClient
        .from('playlists')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', user.id);

      if (playlistError) {
        throw playlistError;
      }

      toast.success('Playlist deleted successfully');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete playlist');
    } finally {
      setIsDeleting(false);
    }
  };

  // Only show delete button if user owns the playlist
  if (!user || user.id !== userId) {
    return null;
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 hover:bg-red-600 flex items-center gap-x-2 w-auto px-6"
    >
      <AiFillDelete size={20} />
      {isDeleting ? 'Deleting...' : 'Delete Playlist'}
    </Button>
  );
};

export default DeletePlaylistButton;
