"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from '@/components/UploadModal';
import SubscribeModal from '@/components/SubscribeModalSepay';
import PlaylistModal from "@/components/PlaylistModal";
import EditSongModal from "@/components/EditSongModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <SubscribeModal />
      <UploadModal />
      <PlaylistModal />
      <EditSongModal />
    </>
  );
}

export default ModalProvider;
