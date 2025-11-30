import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Artist } from "@/types";

const getArtistById = async (id: string): Promise<Artist | null> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log(error.message);
    return null;
  }

  return data as Artist;
};

export default getArtistById;
