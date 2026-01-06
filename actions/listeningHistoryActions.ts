"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Add a song to user's listening history
 */
export const addToListeningHistory = async (songId: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return { error: "Not authenticated" };
  }

  // Insert into listening_history
  const { error } = await supabase
    .from('listening_history')
    .insert({
      user_id: sessionData.session.user.id,
      song_id: songId,
      played_at: new Date().toISOString()
    });

  if (error) {
    console.error('Add to listening history error:', error);
    return { error: error.message };
  }

  return { success: true };
};

/**
 * Clear all listening history for current user
 */
export const clearListeningHistory = async () => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('listening_history')
    .delete()
    .eq('user_id', sessionData.session.user.id);

  if (error) {
    console.error('Clear listening history error:', error);
    return { error: error.message };
  }

  return { success: true };
};
