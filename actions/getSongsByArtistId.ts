import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

const getSongsByArtistId = async (artistId: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('artist_id', artistId)
    .order('play_count', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as Song[]) || [];
};

export default getSongsByArtistId;
