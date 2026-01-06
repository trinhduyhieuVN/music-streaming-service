import Image from "next/image";
import { MdHistory } from "react-icons/md";

import getListeningHistory from "@/actions/getListeningHistory";
import Header from "@/components/Header";
import HistoryContent from "@/components/HistoryContent";

export const revalidate = 0;

const HistoryPage = async () => {
  const history = await getListeningHistory(50);

  return (
    <div className="
      bg-neutral-900 
      rounded-lg 
      h-full 
      w-full 
      overflow-hidden 
      overflow-y-auto
    ">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <div className="
                h-full 
                w-full 
                rounded-md 
                bg-gradient-to-br 
                from-purple-700 
                to-blue-300
                flex 
                items-center 
                justify-center
              ">
                <MdHistory className="text-white" size={80} />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Playlist
              </p>
              <h1 className="
                text-white 
                text-4xl 
                sm:text-5xl 
                lg:text-7xl 
                font-bold
              ">
                Listening History
              </h1>
              <p className="text-neutral-400 text-sm mt-2">
                Your recently played songs
              </p>
            </div>
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7">
        <HistoryContent initialHistory={history} />
      </div>
    </div>
  );
};

export default HistoryPage;
