"use client";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";

import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";

interface AddToPlaylistButtonProps {
  songId: string;
  playlistId: string;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({
  songId,
  playlistId,
}) => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const authModal = useAuthModal();
  const { user } = useUser();

  const handleAdd = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    // Get current max position
    const { data: existingSongs } = await supabaseClient
      .from('playlist_songs')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = (existingSongs?.[0]?.position || 0) + 1;

    const { error } = await supabaseClient
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_id: songId,
        position: nextPosition,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Song already in playlist');
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success('Added to playlist!');
    router.refresh();
  };

  return (
    <button
      onClick={handleAdd}
      className="
        hover:opacity-75
        transition
      "
    >
      <AiOutlinePlus className="text-neutral-400 hover:text-white" size={20} />
    </button>
  );
};

export default AddToPlaylistButton;
