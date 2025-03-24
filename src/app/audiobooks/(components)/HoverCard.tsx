'use client';
import shimmer from "@/components/Shimmer";
import toBase64 from "@/components/ToBasesf";
import { HoverCardProps } from "@/DummyApi/typeScript";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { CiPause1, CiPlay1 } from "react-icons/ci";



export const HoverCard: React.FC<HoverCardProps> = ({ mdt, smi, ipp, idx }) => {
  return (
    <div
      className={`group w-full aspect-square ${
        idx === smi ? "" : "md:hover:scale-125 md:hover:z-20"
      } duration-300 ease-in-out shadow-xl relative cursor-pointer`}
    >
      <figure>
        <Image
          src={mdt.cSquare}
          alt={mdt.cSeasons[0]?.cEpisodes[0]?.cTitle || "Episode Image"} // ✅ Fixed property access
          width={300}
          height={300}
          className="cover w-full h-full"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`} // ✅ Fixed placeholder
        />
      </figure>

      {/* Title & Progress Indicator */}
      <div className="absolute top-6 sm:top-0 w-full h-full">
        <div className="flex items-center w-full">
          <div className="w-4 h-6 md:group-hover:w-8 duration-200 ease-in-out bg-white" />
          <div className="w-full bg-gradient-to-r from-black to-transparent pl-3 md:texl-md text-xs">
            {mdt?.cSeasons[0]?.cEpisodes[0]?.cTitle}
          </div>
        </div>
      </div>

      {/* Artist/Author Info */}
      <div className="absolute bottom-0 w-full bg-black/25">
        <Marquee>
          {mdt.cAuthors.map((author) => (
            <div key={author} className="badge badge-outline sm:text-xs">
              {author}
            </div>
          ))}
        </Marquee>
        <Marquee>
          <div className="text-sm sm:text-xs">
            <div>{mdt.cDescription}</div>
          </div>
        </Marquee>
      </div>

      {/* Play/Pause Button */}
      <div className="flex absolute w-full h-full justify-center items-center top-0">
        <div className="bg-[#436be160] w-12 h-12 flex justify-center items-center p-4 rounded-full md:group-hover:rounded-none md:group-hover:w-full md:group-hover:h-full duration-300 ease-in-out">
          {idx === smi && ipp ? (
            <CiPause1 className="text-2xl font-bold group-hover:text-5xl group-hover:animate-bounce duration-300 ease-in-out" />
          ) : (
            <CiPlay1 className="text-2xl font-bold group-hover:text-5xl group-hover:animate-bounce duration-300 ease-in-out" />
          )}
        </div>
      </div>
    </div>
  );
};
