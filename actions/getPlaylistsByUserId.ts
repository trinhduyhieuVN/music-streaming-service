import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Playlist } from "@/types";

const getPlaylistsByUserId = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return [];
  }

  const { data, error } = await supabase
    .from('playlists')
    .select(`
      *,
      playlist_songs(count)
    `)
    .eq('user_id', sessionData.session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  const playlists = data?.map(playlist => ({
    ...playlist,
    song_count: playlist.playlist_songs?.[0]?.count || 0
  }));

  return (playlists as Playlist[]) || [];
};

export default getPlaylistsByUserId;
