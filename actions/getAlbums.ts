import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Album } from "@/types";

const getAlbums = async (): Promise<Album[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      artist:artists(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as Album[]) || [];
};

export default getAlbums;
