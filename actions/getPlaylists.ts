import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Playlist } from "@/types";

const getPlaylists = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      playlist_songs(count)
    `)
    .or(`is_public.eq.true,user_id.eq.${sessionData.session?.user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  // Map count to song_count
  const playlists = data?.map(playlist => ({
    ...playlist,
    song_count: playlist.playlist_songs?.[0]?.count || 0
  }));

  return (playlists as Playlist[]) || [];
};

export default getPlaylists;
