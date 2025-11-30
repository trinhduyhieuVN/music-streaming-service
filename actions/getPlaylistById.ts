import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Playlist, Song } from "@/types";

const getPlaylistById = async (id: string): Promise<Playlist | null> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  // Get playlist info
  const { data: playlist, error: playlistError } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', id)
    .single();

  if (playlistError) {
    console.log(playlistError.message);
    return null;
  }

  // Get songs in playlist
  const { data: playlistSongs, error: songsError } = await supabase
    .from('playlist_songs')
    .select(`
      *,
      song:songs(*)
    `)
    .eq('playlist_id', id)
    .order('position', { ascending: true });

  if (songsError) {
    console.log(songsError.message);
  }

  const songs = playlistSongs?.map(ps => ps.song).filter(Boolean) as Song[];

  return {
    ...playlist,
    songs: songs || [],
    song_count: songs?.length || 0
  } as Playlist;
};

export default getPlaylistById;
