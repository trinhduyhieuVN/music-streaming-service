import getSongsByArtist from "@/actions/getSongsByArtist";
import ArtistContent from "./components/ArtistContent";

export const revalidate = 0;

interface ArtistPageProps {
  searchParams: {
    name: string;
  };
}

const ArtistPage = async ({ searchParams }: ArtistPageProps) => {
  const artistName = searchParams.name || '';
  const songs = await getSongsByArtist(artistName);

  return <ArtistContent songs={songs} artistName={artistName} />;
};

export default ArtistPage;
