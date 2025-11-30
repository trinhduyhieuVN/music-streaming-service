"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdDisc } from "react-icons/io";

import { Album } from "@/types";
import PlayButton from "./PlayButton";

interface AlbumItemProps {
  data: Album;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/album/${data.id}`);
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
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden bg-neutral-800">
        {data.cover_url ? (
          <Image
            className="object-cover"
            src={data.cover_url}
            fill
            alt={data.title}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <IoMdDisc className="text-neutral-400" size={40} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.title}
        </p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          {data.artist?.name || 'Unknown Artist'}
        </p>
      </div>
      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
    </div>
  );
};

export default AlbumItem;
