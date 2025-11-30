import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

const getSongsByAlbumId = async (albumId: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: true });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as Song[]) || [];
};

export default getSongsByAlbumId;
