"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import usePlayer from "@/hooks/usePlayer";
import useAuthModal from "@/hooks/useAuthModal";

interface ListeningHistoryItem {
  id: string;
  song_id: string;
  played_at: string;
  song?: Song;
}

interface HistoryContentProps {
  initialHistory: ListeningHistoryItem[];
}

const HistoryContent: React.FC<HistoryContentProps> = ({ initialHistory }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user } = useUser();
  const player = usePlayer();
  const authModal = useAuthModal();
  
  const [history, setHistory] = useState<ListeningHistoryItem[]>(initialHistory);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchHistory = async () => {
      const { data } = await supabase
        .from('listening_history')
        .select(`
          *,
          song:songs(*)
        `)
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(50);

      if (data) {
        setHistory(data);
      }
    };

    fetchHistory();
  }, [user?.id, supabase]);

  const handlePlay = (song: Song) => {
    if (!user) {
      return authModal.onOpen();
    }

    // Get all songs from history for queue
    const songs = history
      .filter(item => item.song)
      .map(item => item.song as Song);
    
    player.setId(song.id);
    player.setIds(songs.map((s) => s.id));
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        <p className="text-center py-10">No listening history yet.</p>
      </div>
    );
  }

  // Group by date
  const groupedHistory = history.reduce((acc, item) => {
    if (!item.song) return acc;
    
    const date = new Date(item.played_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ListeningHistoryItem[]>);

  return (
    <div className="flex flex-col gap-y-6 w-full px-6">
      {Object.entries(groupedHistory).map(([date, items]) => (
        <div key={date} className="flex flex-col gap-y-2">
          <h3 className="text-neutral-400 text-sm font-semibold px-2">
            {date}
          </h3>
          <div className="flex flex-col gap-y-1">
            {items.map((item) => {
              if (!item.song) return null;
              
              const song = item.song as Song;
              const time = new Date(item.played_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-x-4 w-full p-2 rounded-md hover:bg-neutral-800/50 transition group"
                >
                  <div className="flex-1 min-w-0">
                    <MediaItem
                      onClick={() => handlePlay(song)}
                      data={song}
                    />
                  </div>
                  <div className="flex items-center gap-x-4">
                    <span className="text-neutral-400 text-sm hidden md:block">
                      {time}
                    </span>
                    <LikeButton songId={song.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryContent;
