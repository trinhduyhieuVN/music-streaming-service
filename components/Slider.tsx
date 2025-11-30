"use client";

import * as RadixSlider from '@radix-ui/react-slider';

interface SlideProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SlideProps> = ({ 
  value = 1, 
  onChange
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return ( 
    <RadixSlider.Root
      className="
        relative 
        flex 
        items-center 
        select-none 
        touch-none 
        w-full 
        h-10
        group
        cursor-pointer
      "
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      aria-label="Volume"
    >
      <RadixSlider.Track 
        className="
          bg-[#4d4d4d]
          relative 
          grow 
          rounded-full 
          h-[4px]
        "
      >
        <RadixSlider.Range 
          className="
            absolute 
            bg-white
            group-hover:bg-[#1db954]
            rounded-full 
            h-full
            transition-colors
          " 
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb 
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
    </RadixSlider.Root>
  );
}
 
export default Slider;
