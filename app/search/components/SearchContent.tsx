"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import { HiUserCircle, HiMusicalNote } from "react-icons/hi2";
import ArtistAvatar from "@/components/ArtistAvatar";
import { generateUniqueInitials } from "@/utils/avatarUtils";

interface Artist {
  name: string;
  image?: string;
  songCount: number;
}

interface SearchContentProps {
  songs: Song[];
  artists?: Artist[];
  query?: string;
}

const SearchContent: React.FC<SearchContentProps> = ({
  songs,
  artists = [],
  query = ""
}) => {
  const router = useRouter();
  const onPlay = useOnPlay(songs);

  // Generate unique initials for all artists
  const artistInitials = useMemo(() => {
    return generateUniqueInitials(artists.map(a => ({ author: a.name })));
  }, [artists]);

  const handleArtistClick = (artistName: string) => {
    // Navigate to artist page
    router.push(`/artist?name=${encodeURIComponent(artistName)}`);
  };

  const hasResults = songs.length > 0 || artists.length > 0;

  if (!hasResults) {
    return (
      <div 
        className="
          flex 
          flex-col 
          gap-y-2 
          w-full 
          px-6 
          text-neutral-400
        "
      >
        <div className="text-center py-10">
          <HiMusicalNote className="mx-auto text-neutral-600 mb-4" size={64} />
          <p className="text-lg">No results found for "{query}"</p>
          <p className="text-sm mt-2">Try different keywords</p>
        </div>
      </div>
    )
  }

  return ( 
    <div className="flex flex-col gap-y-6 w-full px-6 pb-6">
      {/* Artists Section */}
      {artists.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">Artists</h2>
            <span className="text-neutral-400 text-sm">{artists.length} result{artists.length > 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artists.map((artist) => (
              <div
                key={artist.name}
                onClick={() => handleArtistClick(artist.name)}
                className="
                  group
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  overflow-hidden
                  gap-y-3
                  bg-neutral-800/40
                  hover:bg-neutral-800
                  transition
                  p-4
                  cursor-pointer
                "
              >
                <div className="
                  relative
                  aspect-square
                  w-full
                  flex
                  items-center
                  justify-center
                ">
                  <ArtistAvatar 
                    artistName={artist.name}
                    initials={artistInitials.get(artist.name) || '?'}
                    size="lg"
                  />
                  <div className="
                    absolute
                    bottom-2
                    right-2
                    bg-green-500
                    rounded-full
                    p-2
                    opacity-0
                    group-hover:opacity-100
                    transition
                    shadow-lg
                  ">
                    <HiMusicalNote className="text-black" size={20} />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-y-1 w-full">
                  <p className="text-white font-semibold truncate w-full text-center">
                    {artist.name}
                  </p>
                  <p className="text-neutral-400 text-sm">
                    {artist.songCount} song{artist.songCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Songs Section */}
      {songs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-semibold">Songs</h2>
            <span className="text-neutral-400 text-sm">{songs.length} result{songs.length > 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-col gap-y-2">
            {songs.map((song: Song) => (
              <div 
                key={song.id} 
                className="flex items-center gap-x-4 w-full"
              >
                <div className="flex-1">
                  <MediaItem 
                    onClick={(id: string) => onPlay(id)} 
                    data={song}
                  />
                </div>
                <LikeButton songId={song.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
 
export default SearchContent;