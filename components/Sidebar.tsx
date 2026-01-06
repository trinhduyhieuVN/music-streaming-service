"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { HiChartBar } from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import { Song, Playlist } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import useIsAdmin from "@/hooks/useIsAdmin";

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import Library from "./Library";
import { useMemo } from "react";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  playlists?: Playlist[];
}

const Sidebar = ({ children, songs, playlists = [] }: SidebarProps) => {
  const pathname = usePathname();
  const player = usePlayer();
  const { isAdmin } = useIsAdmin();

  const routes = useMemo(() => {
    const baseRoutes = [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname === '/',
        href: '/'
      },
      {
        icon: BiSearch,
        label: 'Search',
        href: '/search',
        active: pathname === '/search'
      },
      {
        icon: MdHistory,
        label: 'History',
        href: '/history',
        active: pathname === '/history'
      },
      {
        icon: HiChartBar,
        label: 'Dashboard',
        href: '/dashboard',
        active: pathname === '/dashboard'
      },
    ];

    // Only show Manage Songs for admin
    if (isAdmin) {
      baseRoutes.push({
        icon: FiSettings,
        label: 'Manage Songs',
        href: '/manage',
        active: pathname === '/manage'
      });
    }

    return baseRoutes;
  }, [pathname, isAdmin]);

  return (
    <div 
      className={twMerge(`
        flex 
        h-full
        transition-all
        duration-300
        `,
        player.activeId && 'h-[calc(100%-90px)]'
      )}
    >
      <div 
        className="
          hidden 
          md:flex 
          flex-col 
          gap-y-2 
          bg-black 
          h-full 
          w-[300px] 
          p-2
          transition-all
          duration-300
        "
      >
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item, index) => (
              <div
                key={item.label}
                className="animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SidebarItem {...item} />
              </div>
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} playlists={playlists} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}
 
export default Sidebar;