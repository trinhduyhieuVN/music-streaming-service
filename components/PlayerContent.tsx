"use client";


import { useEffect, useState, useCallback } from "react";
import { BsPauseFill, BsPlayFill, BsShuffle } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import { MdQueueMusic } from "react-icons/md";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { addToListeningHistory } from "@/actions/listeningHistoryActions";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import SeekBar from "./SeekBar";
import useSound from 'use-sound';
import QueuePanel from "./QueuePanel";


interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ 
  song, 
  songUrl
}) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      // If repeat all is on, go back to first song
      if (player.repeatMode === 'all') {
        return player.setId(player.ids[0]);
      }
      return;
    }

    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  }

  const handleShuffle = () => {
    player.toggleShuffle();
  }

  const handleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(player.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    player.setRepeatMode(nextMode);
  }

  const [play, { pause, sound }] = useSound(
    songUrl,
    { 
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        // Save to listening history when song starts playing
        addToListeningHistory(song.id).catch(console.error);
      },
      onend: () => {
        setIsPlaying(false);
        // Handle repeat one
        if (player.repeatMode === 'one') {
          play();
        } else {
          onPlayNext();
        }
      },
      onpause: () => setIsPlaying(false),
      onload: () => {
        // Get duration when sound is loaded
        if (sound) {
          setDuration(sound.duration() || 0);
        }
      },
      format: ['mp3']
    }
  );

  // Update current time every 100ms while playing
  useEffect(() => {
    if (!sound) return;

    // Set duration once sound is available
    const dur = sound.duration();
    if (dur) setDuration(dur);

    const interval = setInterval(() => {
      if (sound.playing()) {
        setCurrentTime(sound.seek() || 0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [sound]);

  // Handle seeking
  const handleSeek = useCallback((newTime: number) => {
    if (sound) {
      sound.seek(newTime);
      setCurrentTime(newTime);
    }
  }, [sound]);

  useEffect(() => {
    sound?.play();
    
    return () => {
      sound?.unload();
    }
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }

  return ( 
    <div className="grid grid-cols-3 h-full items-center">
      {/* Left - Song Info */}
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      {/* Center - Controls + Progress Bar */}
      <div className="flex flex-col items-center justify-center w-full max-w-[722px] mx-auto gap-y-1">
        {/* Playback Controls */}
        <div className="flex items-center gap-x-6">
          <BsShuffle
            onClick={handleShuffle}
            size={18} 
            className={`cursor-pointer transition ${
              player.isShuffled 
                ? 'text-green-500 hover:text-green-400' 
                : 'text-neutral-400 hover:text-white'
            }`}
            title={player.isShuffled ? "Shuffle on" : "Shuffle off"}
          />
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={22} 
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div 
            onClick={handlePlay} 
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer hover:scale-110 transition transform active:scale-95"
          >
            <Icon size={24} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={22} 
            className="text-neutral-400 cursor-pointer hover:text-white transition" 
          />
          {player.repeatMode === 'off' && (
            <TbRepeat
              onClick={handleRepeat}
              size={20}
              className="text-neutral-400 cursor-pointer hover:text-white transition"
              title="Repeat off"
            />
          )}
          {player.repeatMode === 'all' && (
            <TbRepeat
              onClick={handleRepeat}
              size={20}
              className="text-green-500 cursor-pointer hover:text-green-400 transition"
              title="Repeat all"
            />
          )}
          {player.repeatMode === 'one' && (
            <TbRepeatOnce
              onClick={handleRepeat}
              size={20}
              className="text-green-500 cursor-pointer hover:text-green-400 transition"
              title="Repeat one"
            />
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-[500px]">
          <SeekBar 
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>
      </div>

      {/* Right - Volume */}
      <div className="flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[160px]">
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`cursor-pointer transition ${
              showQueue ? 'text-green-500' : 'text-neutral-400 hover:text-white'
            }`}
            title="Queue"
          >
            <MdQueueMusic size={22} />
          </button>
          <VolumeIcon 
            onClick={toggleMute} 
            className="cursor-pointer text-neutral-400 hover:text-white transition" 
            size={22} 
          />
          <Slider 
            value={volume} 
            onChange={(value) => setVolume(value)}
          />
        </div>
      </div>

      {/* Queue Panel */}
      <QueuePanel isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
   );
}
 
export default PlayerContent;