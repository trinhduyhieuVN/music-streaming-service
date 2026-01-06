"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useDeleteSong = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deleteSong = async (songId: string): Promise<boolean> => {
    if (!songId) {
      toast.error("Song ID is required");
      return false;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete song');
      }

      toast.success('Song deleted successfully');
      router.refresh();
      return true;

    } catch (error: any) {
      toast.error(error.message || 'Failed to delete song');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteSong, isDeleting };
};

export default useDeleteSong;
