import shimmer from "@/components/Shimmer";
import toBase64 from "@/components/ToBasesf";
import { TMusicData } from "@/model/typeScript";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { CiPause1, CiPlay1 } from "react-icons/ci";

interface HoverCardProps {
    mdt: TMusicData;
    smi: null | number;
    ipp: boolean;
    idx: number;
}


export const HoverCard: React.FC<HoverCardProps> = ({ mdt, smi, ipp, idx }) => {

    return (
        <div className={`group w-full aspect-square ${idx === smi ? '' : 'big:hover:scale-125 big:hover:z-20'} duration-300 ease-in-out shadow-xl relative cursor-pointer`}>
            <figure>
                <Image
                    src={mdt.songImage}
                    alt={mdt.title}
                    width={300}
                    height={300}
                    className="cover w-full h-full"
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
                />
            </figure>
            <div className="absolute top-6 sm:top-0 w-full h-full">
                <div className="flex items-center w-full">
                    <div className="w-4 h-6 big:group-hover:w-8 duration-200 ease-in-out bg-white" />
                    <div className="w-full bg-gradient-to-r from-black to-transparent pl-3 sm:text-xs">
                        {mdt.title}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 w-full bg-black/25">
                <Marquee >
                    <div className="space-x-2">
                        {
                            mdt.singer.map(s => {
                                return (
                                    <div key={s.id} className="badge badge-outline sm:text-xs">{s}</div>
                                )
                            }

                            )
                        }
                    </div>
                </Marquee>
                <Marquee >
                    <div className="text-sm sm:text-xs">
                        <div>{mdt.description}</div>
                    </div>
                </Marquee>
            </div>
            <div className="flex absolute w-full h-full justify-center items-center top-0">
                <div className="bg-[#436be160] w-12 h-12 flex justify-center items-center p-4 rounded-full big:group-hover:rounded-none big:group-hover:w-full big:group-hover:h-full duration-300 ease-in-out">
                    {
                        idx === smi && ipp
                            ?
                            <CiPause1 className="text-2xl font-bold  group-hover:text-5xl group-hover:animate-bounce duration-300 ease-in-out" />
                            :
                            <CiPlay1 className="text-2xl font-bold  group-hover:text-5xl group-hover:animate-bounce duration-300 ease-in-out" />}
                </div>
            </div>
        </div>
    );
};
