"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { useMemo } from "react";

import { Artist } from "@/types";
import ArtistAvatar from "./ArtistAvatar";

interface ArtistItemProps {
  data: Artist;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ data }) => {
  const router = useRouter();

  // Generate initials for artist
  const initials = useMemo(() => {
    return data.name.trim().toUpperCase().substring(0, 2);
  }, [data.name]);

  const handleClick = () => {
    router.push(`/artist/${data.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        relative
        group
        flex
        flex-col
        items-center
        justify-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-400/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
      "
    >
      <div className="relative w-full aspect-square flex items-center justify-center">
        <ArtistAvatar 
          artistName={data.name}
          initials={initials}
          size="lg"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full text-center">
          {data.name}
        </p>
        <p className="text-neutral-400 text-sm w-full truncate text-center">
          Artist
        </p>
      </div>
    </div>
  );
};

export default ArtistItem;
