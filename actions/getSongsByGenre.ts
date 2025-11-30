import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

const getSongsByGenre = async (genre: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('genre', `%${genre}%`)
    .order('play_count', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as Song[]) || [];
};

export default getSongsByGenre;
