import searchAll from "@/actions/searchAll";
import getSongsByArtist from "@/actions/getSongsByArtist";
import SearchInput from "@/components/SearchInput";
import Header from "@/components/Header";

import SearchContent from "./components/SearchContent";

export const revalidate = 0;

interface SearchProps {
  searchParams: { 
    title?: string;
    artist?: string;
  }
};

const Search = async ({ searchParams }: SearchProps) => {
  let songs = [];
  let artists = [];
  let query = '';

  // If searching by artist name specifically
  if (searchParams.artist) {
    songs = await getSongsByArtist(searchParams.artist);
    query = searchParams.artist;
  } 
  // If searching by general query
  else if (searchParams.title) {
    const results = await searchAll(searchParams.title);
    songs = results.songs;
    artists = results.artists;
    query = searchParams.title;
  }

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
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Search
          </h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} artists={artists} query={query} />
    </div>
  );
}

export default Search;
