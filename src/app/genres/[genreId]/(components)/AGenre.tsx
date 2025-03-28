'use client'
import { useBookmark } from '@/app/context/BookMarkContext';
import { IContent } from '@/app/models/types';
import shimmer from '@/components/Shimmer';
import toBase64 from '@/components/ToBasesf';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { BiSolidMoviePlay } from 'react-icons/bi';
import { FaBookReader } from 'react-icons/fa';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdBookmarkAdded, MdOutlineBookmarkAdd } from 'react-icons/md';
import { PiHeadphonesFill } from 'react-icons/pi';

export default function AGenre({ genreId }: { genreId: string }) {
  const [generedContentent, setGeneredContentent] = useState<IContent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toggleBookmark, isBookmarked } = useBookmark();

  useEffect(() => {
    const fetchGeneredContentent = async () => {
      try {
        const res = await fetch(`/api/contentcrud/byGenre/${genreId}`);
        if (!res.ok) throw new Error("Failed to fetch bookmarked contents");
        const data = await res.json();
        setGeneredContentent(data.contents);
        console.log(generedContentent);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGeneredContentent();
  }, [generedContentent, genreId]);



  const getInteractIcon = (interactType: string) => {
    switch (interactType) {
      case 'audiostory':
        return <PiHeadphonesFill />;
      case 'Watch':
        return <BiSolidMoviePlay />;
      case 'storyseries':
        return <FaBookReader />;
      case 'story':
        return <FaBookReader />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex flex-wrap w-full p-5">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ">
              <div className="skeletonLoaderBg aspect-video animate-pulse rounded-xl transition-all duration-150 ease-in-out m-2 hover:scale-105">
                <div className="relative flex flex-col items-center p-2">
                  <div className="w-full h-[200px] rounded-xl skeletonLoaderBg"></div>

                  <div className="absolute bottom-0 p-3 w-full rounded-b-xl skeletonLoaderBg">
                    <div className="w-2/3 h-6 skeletonLoaderBg rounded-md mb-2"></div>
                    <div className="w-full h-4 skeletonLoaderBg rounded-md mb-1"></div>
                    <div className="w-5/6 h-4 skeletonLoaderBg rounded-md"></div>

                    <div className="flex space-x-2 mt-3">
                      <div className="w-6 h-6 skeletonLoaderBg rounded-md"></div>
                      <div className="w-6 h-6 skeletonLoaderBg rounded-md"></div>
                      <div className="w-6 h-6 skeletonLoaderBg rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );


  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex flex-wrap w-full p-5">
        {
          generedContentent ?
            (generedContentent ?? []).map((content) => {
              return (
                <div key={content.cTitle}
                  data-tip={`${content.cDescription}`}
                  className={`relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 group md:hover:scale-110 hover:z-30 transition-all duration-100 ease-in-out  embla__slide_Card sliderBgGroup`} >

                  <div className="relative md:m-2 m-[2px] group-hover:z-30 flex flex-col items-center">
                    <Link href={`/${content.cContentType}/${content.cId}`}>
                      <Image
                        src={content.cCard}
                        alt="Responsive Image"
                        width='1000'
                        height='563'
                        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 563))}`}
                        className="rounded-xl object-cover"
                      />
                    </Link>

                    <div className="absolute z-4 bottom-0 md:p-3 p-2 flex flex-col md:group-hover:items-start items-end md:group-hover:animate-slideIn cards-bg w-full rounded-b-xl ">
                      <Link className="flex flex-col md:group-hover:items-start items-end" href={`/${content.cContentType}/${content.cId}`}>
                        <Image
                          src={content.cLogo}
                          alt={`${content.cTitle}`}
                          width="100"
                          height="100"
                          className="!w-2/3 md:group-hover:!w-1/3 object-cover"
                        />
                      </Link>
                      {/* Hidden content that will slide in and out */}
                      <div className="hidden w-full md:group-hover:block md:group-hover:animate-slideIn animate-slideOut">
                        <Link href={`/${content.cContentType}/${content.cId}`}>
                          <h1 className="font-bold text-[1vw]">{content.cTitle}</h1>
                          <p className="text-[.7vw] tooltip tooltip-primary" data-tip={content.cDescription}>
                            {content.cDescription.length > 30
                              ? content.cDescription.slice(0, 30) + '...'
                              : content.cDescription
                            }
                          </p>
                        </Link>
                        <div className="flex z-40 space-x-1">

                          <Link href={`/${content.cContentType}/${content.cId}`}><button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l">
                            {getInteractIcon(content.cContentType)}
                          </button></Link>

                          <button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l"><IoShareSocialOutline /></button>
                          <button onClick={() => toggleBookmark(content.cId)} className={`btn ${isBookmarked(content.cId) ? 'btn-info' : 'btn-primary'} mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l`}>
                            {isBookmarked(content.cId) ? <MdBookmarkAdded /> : <MdOutlineBookmarkAdd />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
            :
            <h1>Nothing Bookmarked</h1>
        }
      </div>
    </div>
  );
}
