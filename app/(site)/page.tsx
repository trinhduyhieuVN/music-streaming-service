import getSongs from "@/actions/getSongs";
import getArtists from "@/actions/getArtists";
import getAlbums from "@/actions/getAlbums";
import getPlaylists from "@/actions/getPlaylists";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";
import ArtistsSection from "./components/ArtistsSection";
import AlbumsSection from "./components/AlbumsSection";
import PlaylistsSection from "./components/PlaylistsSection";
import GenreList from "@/components/GenreList";


export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const artists = await getArtists();
  const albums = await getAlbums();
  const playlists = await getPlaylists();

  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header>
        <div className="mb-2">
          <h1 
            className="
            text-white 
              text-3xl 
              font-semibold
            ">
              Welcome back
          </h1>
        </div>
      </Header>

      {/* Newest Songs */}
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest songs
          </h1>
        </div>
        <PageContent songs={songs} />
      </div>

      {/* Artists Section */}
      {artists.length > 0 && (
        <div className="mb-7 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">
              Popular Artists
            </h1>
          </div>
          <ArtistsSection artists={artists} />
        </div>
      )}

      {/* Albums Section */}
      {albums.length > 0 && (
        <div className="mb-7 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">
              Albums
            </h1>
          </div>
          <AlbumsSection albums={albums} />
        </div>
      )}

      {/* Genre Section */}
      <div className="mb-7 px-6">
        <GenreList />
      </div>
    </div>
  )
}