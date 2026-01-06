import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Song } from "@/types";

const useLoadImage = (song: Song) => {
  const supabaseClient = useSupabaseClient();
  
  if (!song) {
    return null;
  }

  // If image_path is already a full URL, return it
  if (song.image_path && song.image_path.startsWith('http')) {
    return song.image_path;
  }

  // If no image_path, return placeholder
  if (!song.image_path) {
    return '/images/liked.png';
  }

  const { data: imageData } = supabaseClient
    .storage
    .from('image')
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
