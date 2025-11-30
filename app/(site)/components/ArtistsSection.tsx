"use client";

import { Artist } from "@/types";
import ArtistItem from "@/components/ArtistItem";

interface ArtistsSectionProps {
  artists: Artist[];
}

const ArtistsSection: React.FC<ArtistsSectionProps> = ({ artists }) => {
  if (artists.length === 0) {
    return (
      <div className="mt-4 text-neutral-400">
        No artists available.
      </div>
    );
  }

  return (
    <div
      className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      "
    >
      {artists.slice(0, 8).map((artist) => (
        <ArtistItem key={artist.id} data={artist} />
      ))}
    </div>
  );
};

export default ArtistsSection;
