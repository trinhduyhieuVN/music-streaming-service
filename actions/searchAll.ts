import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const searchAll = async (query: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  if (!query) {
    return { songs: [], artists: [] };
  }

  // Search songs by title or author
  const { data: songsData, error: songsError } = await supabase
    .from('songs')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (songsError) {
    console.log('Songs search error:', songsError.message);
  }

  // Get unique artists from songs
  const songs = (songsData as any) || [];
  const artistsMap = new Map();
  
  songs.forEach((song: any) => {
    if (song.author && song.author.toLowerCase().includes(query.toLowerCase())) {
      if (!artistsMap.has(song.author.toLowerCase())) {
        artistsMap.set(song.author.toLowerCase(), {
          name: song.author,
          image: song.image_path,
          songCount: 1
        });
      } else {
        const artist = artistsMap.get(song.author.toLowerCase());
        artist.songCount += 1;
      }
    }
  });

  const artists = Array.from(artistsMap.values());

  return { songs, artists };
};

export default searchAll;
