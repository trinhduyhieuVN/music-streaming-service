import getSongsByGenre from "@/actions/getSongsByGenre";
import Header from "@/components/Header";
import SearchContent from "@/app/search/components/SearchContent";

interface GenrePageProps {
  params: {
    genreName: string;
  };
}

const GenrePage = async ({ params }: GenrePageProps) => {
  const genreName = decodeURIComponent(params.genreName);
  const songs = await getSongsByGenre(genreName);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold capitalize">
            {genreName}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </Header>
      <div className="px-6">
        <SearchContent songs={songs} />
      </div>
    </div>
  );
};

export default GenrePage;
