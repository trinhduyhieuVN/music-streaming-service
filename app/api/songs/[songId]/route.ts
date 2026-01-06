import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { isAdminEmail } from "@/constants/admin";

// DELETE /api/songs/[songId] - Admin only
export async function DELETE(
  request: Request,
  { params }: { params: { songId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const { songId } = params;

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    // Use service role client for deletion
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Get song info first to delete files from storage
    const { data: song, error: fetchError } = await supabaseAdmin
      .from('songs')
      .select('*')
      .eq('id', songId)
      .single();

    if (fetchError || !song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      );
    }

    // Delete song file from storage if exists
    if (song.song_path) {
      const songFileName = song.song_path.split('/').pop();
      if (songFileName) {
        await supabaseAdmin.storage
          .from('songs')
          .remove([songFileName]);
      }
    }

    // Delete image file from storage if exists
    if (song.image_path) {
      const imageFileName = song.image_path.split('/').pop();
      if (imageFileName) {
        await supabaseAdmin.storage
          .from('images')
          .remove([imageFileName]);
      }
    }

    // Delete from liked_songs first (foreign key constraint)
    await supabaseAdmin
      .from('liked_songs')
      .delete()
      .eq('song_id', songId);

    // Delete from playlist_songs (foreign key constraint)
    await supabaseAdmin
      .from('playlist_songs')
      .delete()
      .eq('song_id', songId);

    // Delete from listening_history (foreign key constraint)
    await supabaseAdmin
      .from('listening_history')
      .delete()
      .eq('song_id', songId);

    // Delete the song
    const { error: deleteError } = await supabaseAdmin
      .from('songs')
      .delete()
      .eq('id', songId);

    if (deleteError) {
      console.error('Delete song error:', deleteError);
      return NextResponse.json(
        { error: "Failed to delete song" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Song deleted successfully", songId },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete song error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
