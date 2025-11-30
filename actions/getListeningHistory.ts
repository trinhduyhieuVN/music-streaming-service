import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ListeningHistory } from "@/types";

const getListeningHistory = async (limit: number = 20): Promise<ListeningHistory[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return [];
  }

  const { data, error } = await supabase
    .from('listening_history')
    .select(`
      *,
      song:songs(*)
    `)
    .eq('user_id', sessionData.session.user.id)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.log(error.message);
    return [];
  }

  return (data as ListeningHistory[]) || [];
};

export default getListeningHistory;
