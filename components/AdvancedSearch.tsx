"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    title: '',
    artist: '',
    genre: '',
    album: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (filters.title) params.append('title', filters.title);
    if (filters.artist) params.append('artist', filters.artist);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.album) params.append('album', filters.album);

    router.push(`/search/advanced?${params.toString()}`);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      title: '',
      artist: '',
      genre: '',
      album: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-x-2">
            <HiAdjustmentsHorizontal size={24} className="text-green-500" />
            <h2 className="text-white text-xl font-semibold">Advanced Search</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Song Title
            </label>
            <input
              type="text"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              placeholder="Enter song title..."
              className="w-full px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Artist
            </label>
            <input
              type="text"
              value={filters.artist}
              onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
              placeholder="Enter artist name..."
              className="w-full px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-green-500 transition"
            >
              <option value="">All Genres</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Electronic">Electronic</option>
              <option value="R&B">R&B</option>
              <option value="Country">Country</option>
              <option value="Latin">Latin</option>
              <option value="K-Pop">K-Pop</option>
              <option value="Indie">Indie</option>
              <option value="Metal">Metal</option>
            </select>
          </div>

          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Album
            </label>
            <input
              type="text"
              value={filters.album}
              onChange={(e) => setFilters({ ...filters, album: e.target.value })}
              placeholder="Enter album name..."
              className="w-full px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:border-green-500 transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-x-3 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition font-medium"
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 px-4 py-3 rounded-md bg-green-500 text-white hover:bg-green-400 transition font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
