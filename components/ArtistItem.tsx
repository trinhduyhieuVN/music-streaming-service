"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";

import { Artist } from "@/types";

interface ArtistItemProps {
  data: Artist;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ data }) => {
  const router = useRouter();

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
      <div className="relative aspect-square w-full h-full rounded-full overflow-hidden bg-neutral-800">
        {data.avatar_url ? (
          <Image
            className="object-cover"
            src={data.avatar_url}
            fill
            alt={data.name}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <FaUserAlt className="text-neutral-400" size={40} />
          </div>
        )}
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
