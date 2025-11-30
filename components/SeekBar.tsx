"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
}

// Format seconds to mm:ss
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    onSeek(newTime);
  };

  return (
    <div className="flex items-center gap-x-2 w-full">
      <span className="text-[11px] text-neutral-400 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-4 cursor-pointer group"
        value={[progress]}
        onValueChange={handleChange}
        max={100}
        step={0.1}
      >
        <SliderPrimitive.Track className="bg-[#4d4d4d] relative grow rounded-full h-1">
          <SliderPrimitive.Range className="absolute bg-white group-hover:bg-[#1db954] rounded-full h-full transition-colors" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className="
            block 
            w-3 
            h-3 
            bg-white 
            rounded-full 
            shadow-md
            opacity-0
            group-hover:opacity-100
            focus:outline-none
            transition-opacity
          " 
        />
      </SliderPrimitive.Root>
      
      <span className="text-[11px] text-neutral-400 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default SeekBar;
