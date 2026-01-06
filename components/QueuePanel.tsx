"use client";

import { useState } from "react";
import { MdQueueMusic } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";

interface QueueItemProps {
  songId: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const QueueItem: React.FC<QueueItemProps> = ({ songId, index, isActive, onClick }) => {
  const { song } = useGetSongById(songId);
  const imageUrl = useLoadImage(song!);

  if (!song) return null;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-x-3 p-2 rounded-md cursor-pointer
        hover:bg-neutral-700/50 transition group
        ${isActive ? 'bg-neutral-700' : ''}
      `}
    >
      <div className="text-neutral-400 font-mono text-sm w-6">
        {index + 1}
      </div>
      <div className="relative min-h-[40px] min-w-[40px]">
        <img
          src={imageUrl || '/images/liked.png'}
          alt={song.title}
          className="object-cover rounded"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden flex-1">
        <p className={`truncate ${isActive ? 'text-green-500' : 'text-white'}`}>
          {song.title}
        </p>
        <p className="text-neutral-400 text-sm truncate">
          {song.author}
        </p>
      </div>
      {isActive && (
        <div className="text-green-500">
          <MdQueueMusic size={20} />
        </div>
      )}
    </div>
  );
};

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueuePanel: React.FC<QueuePanelProps> = ({ isOpen, onClose }) => {
  const player = usePlayer();

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed bottom-[90px] right-2 
        w-[350px] max-h-[500px]
        bg-neutral-900 border border-neutral-800
        rounded-lg shadow-2xl
        flex flex-col
        z-50
        animate-in slide-in-from-bottom-2
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-x-2">
          <MdQueueMusic size={24} className="text-white" />
          <h3 className="text-white font-semibold text-lg">Queue</h3>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition"
        >
          <IoClose size={24} />
        </button>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto p-2">
        {player.ids.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400 p-8">
            <MdQueueMusic size={48} className="mb-4 opacity-50" />
            <p className="text-center">No songs in queue</p>
          </div>
        ) : (
          <div className="space-y-1">
            {player.ids.map((id, index) => (
              <QueueItem
                key={id}
                songId={id}
                index={index}
                isActive={id === player.activeId}
                onClick={() => player.setId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {player.ids.length > 0 && (
        <div className="p-3 border-t border-neutral-800">
          <p className="text-neutral-400 text-sm text-center">
            {player.ids.length} song{player.ids.length > 1 ? 's' : ''} in queue
          </p>
        </div>
      )}
    </div>
  );
};

export default QueuePanel;
