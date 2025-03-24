'use client'
import { IEpisode } from '@/app/models/types';
import shimmer from '@/components/Shimmer';
import toBase64 from '@/components/ToBasesf';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


export default function EpisodePage() {
    const { cContentType, cId, seasonId, episodeId } = useParams();
    const [episode, setEpisode] = useState<IEpisode>();
    const [episodeNo, setEpisodeNo] = useState([]);
    const [loadingEpisode, setLoadingEpisode] = useState(true);


    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const response = await axios.get(`/api/${cId}/${seasonId}/${episodeId}`);
                setEpisode(response.data);
                setLoadingEpisode(false);
            } catch (error) {
                console.error("Error fetching episode count:", error);
                setLoadingEpisode(false);
            }
        };

        fetchEpisode();
    }, [cId, seasonId, episodeId]);


    useEffect(() => {
        const fetchEpisodeSummary = async () => {
            try {
                const response = await axios.get(`/api/episodesummary/${cId}/${seasonId}`);
                setEpisodeNo(response.data);
            } catch (error) {
                console.error("Error fetching episode count:", error);
            }
        };

        fetchEpisodeSummary();
    }, [cId, seasonId]);



    if (loadingEpisode) {
        return (
            <div>
                <div className="w-full relative -z-20">
                    <div className="block md:hidden object-cover w-full h-[550px] skeletonLoaderBg animate-pulse"></div>
                    <div className="hidden md:block lg:hidden object-cover w-full h-[500px] skeletonLoaderBg animate-pulse"></div>
                    <div className="hidden lg:block object-cover w-full h-[450px] skeletonLoaderBg animate-pulse"></div>
                    <div className="absolute contents-bg w-full h-full bottom-0"></div>
                    <div className="w-full flex p-5 justify-center absolute bottom-2">
                        <div className="md:max-w-2/3 w-full flex justify-between items-center">
                            <div className="!w-24 h-24 lg:!w-20 skeletonLoaderBg animate-pulse rounded-full"></div>
                            <div className="flex flex-col justify-end text-right">
                                <div className="w-24 h-6 skeletonLoaderBg animate-pulse mb-2 rounded-md"></div>
                                <div className="w-32 h-4 skeletonLoaderBg animate-pulse rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="top-2 p-5 w-full flex flex-col justify-center items-center">
                    <div className="flex flex-col justify start md:max-w-2/3 w-full">
                        {
                            cContentType == "audiostory" ?
                                <>
                                    <div className="w-full h-auto aspect-video skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="flex justify-between md:max-w-2/3 w-full pt-5">
                                        <div className="w-24 h-10 rounded-md skeletonLoaderBg animate-pulse"></div>
                                        <div className="w-24 h-10 rounded-md skeletonLoaderBg animate-pulse"></div>
                                    </div>
                                </>

                                :
                                <>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-2/3 h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-1/4 h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-full h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="w-1/3 h-4 skeletonLoaderBg animate-pulse rounded-md mb-2"></div>
                                    <div className="flex justify-between md:max-w-2/3 w-full pt-5">
                                        <div className="w-24 h-10 rounded-md skeletonLoaderBg animate-pulse"></div>
                                        <div className="w-24 h-10 rounded-md skeletonLoaderBg animate-pulse"></div>
                                    </div>
                                </>
                        }
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='w-full relative -z-20'>
                {episode && <Image unoptimized src={episode.cPortrait} alt="Responsive Image" width={1094} height={1625} className="block md:hidden object-cover" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1094, 1625))}`} />}
                {episode && <Image unoptimized src={episode.cLandscape} alt="Responsive Image" width={2375} height={1137} className="hidden md:block lg:hidden object-cover" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 1137))}`} />}
                {episode && <Image unoptimized src={episode.cBanner} alt="Responsive Image" width={2375} height={825} className="hidden lg:block object-cover" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 825))}`} />}
                <div className='absolute contents-bg w-full h-full bottom-0' />
                <div className='w-full flex p-5 justify-center absolute bottom-2'>
                    <div className=" md:max-w-2/3 w-full flex justify-between items-center">
                        {episode && <Image unoptimized src={episode.cLogo} alt="Logo Image" width='200' height='200' className={`!w-1/3 lg:!w-1/8 object-cover`} loading='eager' />}
                        <div className='flex flex-col justify-end text-right'>
                            <h1>Episode: {episode?.cNo}</h1>
                            <h1 className='text-xs'>{episode?.cTitle}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='top-2 p-5 w-full flex flex-col justify-center items-center'>
                {
                    episode?.cFullEpisode != "null" &&
                    <p className="whitespace-pre-wrap md:max-w-2/3 w-full">
                        {episode?.cFullEpisode?.replace(/\\n/g, "\n")}
                    </p>
                }
                {
                    episode?.cNextEpisodeSpoilers != "null" &&
                    <p className="whitespace-pre-wrap md:max-w-2/3 w-full pt-10">
                        <span className="text-primary font-bold">আগামী পর্বেঃ</span><br />
                        {episode?.cNextEpisodeSpoilers?.replace(/\\n/g, "\n")}
                    </p>
                }
                {
                    episode?.cYtId !== "null" && (
                        <iframe
                            className=" md:max-w-2/3 w-full aspect-video md:rounded-lg"
                            src={`https://www.youtube.com/embed/${episode?.cYtId}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
                            allowFullScreen
                        ></iframe>
                    )
                }

                <div className='flex justify-between md:max-w-2/3 w-full pt-5'>
                    {episodeId && parseInt(episodeId[1]) > 1 && (
                        <Link href={`/${cContentType}/${cId}/${seasonId}/e${parseInt(episodeId[1]) - 1}`}>
                            <button className="btn btn-primary">Previous</button>
                        </Link>
                    )}

                    {episodeId && episodeNo?.length && parseInt(episodeId[1]) < episodeNo.length && (
                        <Link href={`/${cContentType}/${cId}/${seasonId}/e${parseInt(episodeId[1]) + 1}`}>
                            <button className="btn btn-primary">Next</button>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    )
}
