import Image from "next/image";
import { IoMdDisc } from "react-icons/io";

import getAlbumById from "@/actions/getAlbumById";
import getSongsByAlbumId from "@/actions/getSongsByAlbumId";

import Header from "@/components/Header";
import AlbumContent from "./components/AlbumContent";

interface AlbumPageProps {
  params: {
    albumId: string;
  };
}

const AlbumPage = async ({ params }: AlbumPageProps) => {
  const album = await getAlbumById(params.albumId);
  const songs = await getSongsByAlbumId(params.albumId);

  if (!album) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <div className="mt-20">
            <h1 className="text-white text-3xl font-semibold">
              Album not found
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
            <div className="relative h-32 w-32 lg:h-44 lg:w-44 rounded-md overflow-hidden bg-neutral-800 flex items-center justify-center">
              {album.cover_url ? (
                <Image
                  fill
                  src={album.cover_url}
                  alt={album.title}
                  className="object-cover"
                />
              ) : (
                <IoMdDisc className="text-neutral-400" size={60} />
              )}
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Album</p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {album.title}
              </h1>
              <div className="flex items-center gap-x-2 mt-2">
                <p className="text-neutral-400 text-sm">
                  {album.artist?.name || 'Unknown Artist'}
                </p>
                {album.release_date && (
                  <>
                    <span className="text-neutral-400">•</span>
                    <p className="text-neutral-400 text-sm">
                      {new Date(album.release_date).getFullYear()}
                    </p>
                  </>
                )}
                <span className="text-neutral-400">•</span>
                <p className="text-neutral-400 text-sm">{songs.length} songs</p>
              </div>
            </div>
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <AlbumContent songs={songs} />
      </div>
    </div>
  );
};

export default AlbumPage;
