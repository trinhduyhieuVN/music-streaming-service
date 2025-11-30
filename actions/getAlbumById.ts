import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Album } from "@/types";

const getAlbumById = async (id: string): Promise<Album | null> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      artist:artists(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.log(error.message);
    return null;
  }

  return data as Album;
};

export default getAlbumById;
