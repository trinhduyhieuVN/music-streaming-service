"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiPlay, HiHeart, HiClock, HiMusicalNote } from "react-icons/hi2";
import { HiTrendingUp } from "react-icons/hi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import useIsAdmin from "@/hooks/useIsAdmin";
import { Song } from "@/types";

interface Stats {
  totalSongs: number;
  totalPlaylists: number;
  likedSongs: number;
  totalListeningTime: number;
  recentlyPlayed: Song[];
  topGenres: { genre: string; count: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { isAdmin } = useIsAdmin();
  const [stats, setStats] = useState<Stats>({
    totalSongs: 0,
    totalPlaylists: 0,
    likedSongs: 0,
    totalListeningTime: 0,
    recentlyPlayed: [],
    topGenres: []
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Get user's uploaded songs count
        const { count: songsCount } = await supabase
          .from('songs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get playlists count
        const { count: playlistsCount } = await supabase
          .from('playlists')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get liked songs count
        const { count: likedCount } = await supabase
          .from('liked_songs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get listening history
        const { data: historyData } = await supabase
          .from('listening_history')
          .select('*, songs(*)')
          .eq('user_id', user.id)
          .order('played_at', { ascending: false })
          .limit(5);

        // Get top genres
        const { data: genreData } = await supabase
          .from('songs')
          .select('genre')
          .not('genre', 'is', null);

        // Process genre data
        const genreCounts: { [key: string]: number } = {};
        genreData?.forEach((song) => {
          if (song.genre) {
            genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
          }
        });

        const topGenres = Object.entries(genreCounts)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalSongs: songsCount || 0,
          totalPlaylists: playlistsCount || 0,
          likedSongs: likedCount || 0,
          totalListeningTime: 0, // Calculate based on your needs
          recentlyPlayed: historyData?.map(h => h.songs).filter(Boolean) || [],
          topGenres
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, supabase]);

  if (isLoading || loading) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mb-2">
            <h1 className="text-white text-3xl font-semibold">Loading...</h1>
          </div>
        </Header>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Your Dashboard
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Track your music journey
          </p>
        </div>
      </Header>

      <div className="px-6 pb-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Total Songs - Only show for admin */}
          {isAdmin && (
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition">
              <div className="flex items-center justify-between mb-2">
                <HiMusicalNote size={32} className="text-purple-500" />
                <span className="text-purple-400 text-sm font-medium">Songs</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.totalSongs}
              </div>
              <p className="text-neutral-400 text-sm">Uploaded songs</p>
            </div>
          )}

          {/* Total Playlists */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-900/20 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <HiPlay size={32} className="text-green-500" />
              <span className="text-green-400 text-sm font-medium">Playlists</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalPlaylists}
            </div>
            <p className="text-neutral-400 text-sm">Created playlists</p>
          </div>

          {/* Liked Songs */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-900/20 p-6 rounded-xl border border-red-500/20 hover:border-red-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <HiHeart size={32} className="text-red-500" />
              <span className="text-red-400 text-sm font-medium">Favorites</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.likedSongs}
            </div>
            <p className="text-neutral-400 text-sm">Liked songs</p>
          </div>

          {/* Listening Time */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-900/20 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <HiClock size={32} className="text-blue-500" />
              <span className="text-blue-400 text-sm font-medium">Time</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalListeningTime}m
            </div>
            <p className="text-neutral-400 text-sm">Listening time</p>
          </div>
        </div>

        {/* Top Genres */}
        {stats.topGenres.length > 0 && (
          <div className="bg-neutral-800 p-6 rounded-xl mb-8">
            <div className="flex items-center gap-x-2 mb-4">
              <HiTrendingUp size={24} className="text-green-500" />
              <h2 className="text-white text-xl font-semibold">Top Genres</h2>
            </div>
            <div className="space-y-3">
              {stats.topGenres.map((genre, index) => (
                <div key={genre.genre} className="flex items-center gap-x-3">
                  <div className="text-neutral-400 font-mono text-sm w-6">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-medium">{genre.genre}</span>
                      <span className="text-neutral-400 text-sm">{genre.count} songs</span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(genre.count / stats.topGenres[0].count) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Played */}
        {stats.recentlyPlayed.length > 0 && (
          <div className="bg-neutral-800 p-6 rounded-xl">
            <h2 className="text-white text-xl font-semibold mb-4">
              Recently Played
            </h2>
            <div className="space-y-2">
              {stats.recentlyPlayed.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-x-4 p-3 rounded-lg hover:bg-neutral-700 transition cursor-pointer"
                >
                  <div className="relative min-h-[48px] min-w-[48px]">
                    <img
                      src={song.image_path || '/images/liked.png'}
                      alt={song.title}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-medium truncate">{song.title}</p>
                    <p className="text-neutral-400 text-sm truncate">{song.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
