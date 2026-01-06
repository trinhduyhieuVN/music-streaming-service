"use client";

import qs from "query-string";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

import useDebounce from "@/hooks/useDebounce";
import AdvancedSearch from "./AdvancedSearch";

import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>(searchParams?.get('title') || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'songs' | 'artists'>('all');
  const debouncedValue = useDebounce<string>(value, 300);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: '/search',
      query
    });

    router.push(url, { scroll: false });
  }, [debouncedValue, router]);

  return ( 
    <div className="flex flex-col gap-y-3">
      {/* Search Type Tabs */}
      <div className="flex gap-x-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setSearchType('all')}
          className={`
            px-4 py-2 rounded-t-md text-sm font-medium transition
            ${searchType === 'all' 
              ? 'text-white bg-neutral-800' 
              : 'text-neutral-400 hover:text-white'
            }
          `}
        >
          All
        </button>
        <button
          onClick={() => setSearchType('songs')}
          className={`
            px-4 py-2 rounded-t-md text-sm font-medium transition
            ${searchType === 'songs' 
              ? 'text-white bg-neutral-800' 
              : 'text-neutral-400 hover:text-white'
            }
          `}
        >
          Songs
        </button>
        <button
          onClick={() => setSearchType('artists')}
          className={`
            px-4 py-2 rounded-t-md text-sm font-medium transition
            ${searchType === 'artists' 
              ? 'text-white bg-neutral-800' 
              : 'text-neutral-400 hover:text-white'
            }
          `}
        >
          Artists
        </button>
      </div>

      {/* Search Input */}
      <div className="flex gap-x-2">
        <div className="flex-1">
          <Input 
            placeholder={
              searchType === 'all' ? 'Search songs, artists...' :
              searchType === 'songs' ? 'Search for songs...' :
              'Search for artists...'
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAdvanced(true)}
          className="
            bg-neutral-800 
            hover:bg-neutral-700 
            text-white 
            px-4 
            py-3 
            rounded-md 
            transition
            flex
            items-center
            gap-x-2
          "
          title="Advanced Search"
        >
          <HiAdjustmentsHorizontal size={20} />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <AdvancedSearch 
          isOpen={showAdvanced} 
          onClose={() => setShowAdvanced(false)} 
        />
      </div>
    </div>
  );
}
 
export default SearchInput;