import { Figtree } from 'next/font/google'

import getSongsByUserId from '@/actions/getSongsByUserId'
import getPlaylistsByUserId from '@/actions/getPlaylistsByUserId'
import Sidebar from '@/components/Sidebar'
import ToasterProvider from '@/providers/ToasterProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import SupabaseProvider from '@/providers/SupabaseProvider'
import Player from '@/components/Player'

import './globals.css'

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Music Streaming Service',
  description: 'A modern music streaming platform built with Next.js, React, and Supabase',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = await getSongsByUserId();
  const userPlaylists = await getPlaylistsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs} playlists={userPlaylists}>
              {children}
            </Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}