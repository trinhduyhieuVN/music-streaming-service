import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";

import getArtistById from "@/actions/getArtistById";
import getSongsByArtistId from "@/actions/getSongsByArtistId";

import Header from "@/components/Header";
import ArtistContent from "./components/ArtistContent";

interface ArtistPageProps {
  params: {
    artistId: string;
  };
}

const ArtistPage = async ({ params }: ArtistPageProps) => {
  const artist = await getArtistById(params.artistId);
  const songs = await getSongsByArtistId(params.artistId);

  if (!artist) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mt-20">
            <h1 className="text-white text-3xl font-semibold">
              Artist not found
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
            <div className="relative h-32 w-32 lg:h-44 lg:w-44 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center">
              {artist.avatar_url ? (
                <Image
                  fill
                  src={artist.avatar_url}
                  alt={artist.name}
                  className="object-cover"
                />
              ) : (
                <FaUserAlt className="text-neutral-400" size={60} />
              )}
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Artist</p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {artist.name}
              </h1>
              {artist.bio && (
                <p className="text-neutral-400 text-sm mt-2">{artist.bio}</p>
              )}
            </div>
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-2xl font-semibold">Popular songs</h2>
        </div>
        <ArtistContent songs={songs} />
      </div>
    </div>
  );
};

export default ArtistPage;
