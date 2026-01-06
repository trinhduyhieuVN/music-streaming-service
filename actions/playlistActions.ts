"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface CreatePlaylistData {
  name: string;
  description?: string;
  is_public?: boolean;
}

export const createPlaylist = async (data: CreatePlaylistData) => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return { error: "Not authenticated" };
  }

  const { data: playlist, error } = await supabase
    .from('playlists')
    .insert({
      user_id: sessionData.session.user.id,
      name: data.name,
      description: data.description || '',
      is_public: data.is_public ?? false
    })
    .select()
    .single();

  if (error) {
    console.error('Create playlist error:', error);
    return { error: error.message };
  }

  return { playlist };
};

export const addSongToPlaylist = async (playlistId: string, songId: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return { error: "Not authenticated" };
  }

  // Check if song already in playlist
  const { data: existing } = await supabase
    .from('playlist_songs')
    .select('id')
    .eq('playlist_id', playlistId)
    .eq('song_id', songId)
    .single();

  if (existing) {
    return { error: "Song already in playlist" };
  }

  // Get current max position
  const { data: maxPos } = await supabase
    .from('playlist_songs')
    .select('position')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const newPosition = (maxPos?.position || 0) + 1;

  const { error } = await supabase
    .from('playlist_songs')
    .insert({
      playlist_id: playlistId,
      song_id: songId,
      position: newPosition
    });

  if (error) {
    console.error('Add song to playlist error:', error);
    return { error: error.message };
  }

  return { success: true };
};

export const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId);

  if (error) {
    console.error('Remove song from playlist error:', error);
    return { error: error.message };
  }

  return { success: true };
};

export const deletePlaylist = async (playlistId: string) => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session?.user.id) {
    return { error: "Not authenticated" };
  }

  // Delete playlist songs first
  await supabase
    .from('playlist_songs')
    .delete()
    .eq('playlist_id', playlistId);

  // Delete playlist
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId)
    .eq('user_id', sessionData.session.user.id);

  if (error) {
    console.error('Delete playlist error:', error);
    return { error: error.message };
  }

  return { success: true };
};
