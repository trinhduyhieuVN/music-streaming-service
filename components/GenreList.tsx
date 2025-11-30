"use client";

import { useRouter } from "next/navigation";
import { GENRES } from '@/constants/genres';

// Chỉ hiển thị các genre chính (không bao gồm podcast, soundtrack, instrumental)
const DISPLAY_GENRES = GENRES.filter(g => 
  !['soundtrack', 'instrumental', 'podcast'].includes(g.id)
);

const GenreList = () => {
  const router = useRouter();

  const handleClick = (genreName: string) => {
    router.push(`/genre/${encodeURIComponent(genreName)}`);
  };

  return (
    <div className="mt-4">
      <h2 className="text-white text-2xl font-semibold mb-4">
        Browse by Genre
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {DISPLAY_GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleClick(genre.name)}
            className="
              relative
              h-24
              rounded-lg
              overflow-hidden
              hover:scale-105
              hover:shadow-lg
              transition-all
              duration-200
              group
            "
            style={{
              background: `linear-gradient(135deg, ${genre.hex} 0%, ${adjustColor(genre.hex, -30)} 100%)`
            }}
          >
            <span className="
              absolute
              bottom-3
              left-3
              text-white
              font-bold
              text-lg
              drop-shadow-md
            ">
              {genre.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Hàm điều chỉnh màu (làm tối hoặc sáng hơn)
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default GenreList;
