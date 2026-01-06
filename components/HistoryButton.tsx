"use client";

import { useRouter } from "next/navigation";
import { BiHistory } from "react-icons/bi";
import { MdHistory } from "react-icons/md";

const HistoryButton = () => {
  const router = useRouter();

  const onClick = () => {
    router.push('/history');
  };

  return (
    <button
      onClick={onClick}
      className="
        flex 
        items-center 
        gap-x-3 
        px-5 
        py-3
        rounded-md 
        bg-neutral-800/50 
        hover:bg-neutral-800 
        transition 
        text-neutral-400 
        hover:text-white
        w-full
      "
    >
      <MdHistory size={20} />
      <span className="font-medium">Listening History</span>
    </button>
  );
};

export default HistoryButton;
