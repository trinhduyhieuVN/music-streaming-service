import Image from "next/image";
import { RiPlayListFill } from "react-icons/ri";

import getPlaylistById from "@/actions/getPlaylistById";

import Header from "@/components/Header";
import PlaylistContent from "./components/PlaylistContent";
import DeletePlaylistButton from "./components/DeletePlaylistButton";

interface PlaylistPageProps {
  params: {
    playlistId: string;
  };
}

const PlaylistPage = async ({ params }: PlaylistPageProps) => {
  const playlist = await getPlaylistById(params.playlistId);

  if (!playlist) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mt-20">
            <h1 className="text-white text-3xl font-semibold">
              Playlist not found
            </h1>
          </div>
        </Header>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className={`relative h-32 w-32 lg:h-44 lg:w-44 rounded-md overflow-hidden ${playlist.cover_url ? '' : `bg-gradient-to-br ${playlist.color || 'from-purple-700 to-blue-300'}`} flex items-center justify-center`}>
              {playlist.cover_url ? (
                <Image
                  fill
                  src={playlist.cover_url}
                  alt={playlist.name}
                  className="object-cover"
                />
              ) : (
                <RiPlayListFill className="text-white/60" size={60} />
              )}
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-neutral-400 text-sm mt-1">
                  {playlist.description}
                </p>
              )}
              <p className="text-neutral-400 text-sm mt-2">
                {playlist.song_count || 0} songs
              </p>
            </div>
          </div>
          <div className="mt-4">
            <DeletePlaylistButton playlistId={playlist.id} userId={playlist.user_id} />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <PlaylistContent songs={playlist.songs || []} />
      </div>
    </div>
  );
};

export default PlaylistPage;
