import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Artist } from "@/types";

const getArtists = async (): Promise<Artist[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as Artist[]) || [];
};

export default getArtists;
