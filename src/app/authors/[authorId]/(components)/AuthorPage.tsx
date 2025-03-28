"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import toBase64 from "@/components/ToBasesf";
import shimmer from "@/components/Shimmer";
import { IAuthor, IContent } from "@/app/models/types";
import Link from "next/link";
import { useBookmark } from "@/app/context/BookMarkContext";
import { MdBookmarkAdded, MdOutlineBookmarkAdd } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { PiHeadphonesFill } from "react-icons/pi";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaBookReader } from "react-icons/fa";

interface AuthorProps {
  readonly authorId: string;
}


export default function AuthorPage({ authorId }: AuthorProps) {
  const [author, setAuthor] = useState<IAuthor | null>(null);
  const [authorContent, setAuthorContent] = useState<IContent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleBookmark, isBookmarked } = useBookmark();

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthor = async () => {
      try {
        const { data } = await axios.get(`/api/authorscrud/${authorId}`);
        setAuthor(data);
      } catch (error) {
        console.error("Error fetching author:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);


  useEffect(() => {
    if (!authorId) return;

    const fetchAuthorContent = async () => {
      try {
        const { data } = await axios.get(`/api/contentcrud/byAuthor/${authorId}`);
        setAuthorContent(data);
      } catch (error) {
        console.error("Error fetching author content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorContent();
  }, [authorId]);


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
      <div className="flex items-center flex-col md:flex-row w-full md:h-screen">
        <div className="w-full md:w-1/3 md:h-full overflow-auto p-6 md:p-8 lg:p-10 shadow-lg rounded-xl flex flex-col items-center gap-6">
          <div className="w-full aspect-square rounded-lg skeletonLoaderBg animate-pulse" />
          <div className="text-center md:text-left w-full">
            <div className="h-8 w-2/3 skeletonLoaderBg animate-pulse mb-4" />
            <div className="h-4 w-full skeletonLoaderBg animate-pulse mb-2" />
            <div className="h-4 w-full skeletonLoaderBg animate-pulse mb-2" />
            <div className="h-4 w-full skeletonLoaderBg animate-pulse mb-2" />
            <div className="h-4 w-full skeletonLoaderBg animate-pulse mb-2" />
            <div className="h-4 w-3/4 skeletonLoaderBg animate-pulse mb-2" />
            <div className="h-4 w-full skeletonLoaderBg animate-pulse mb-2" />
            <div className="h-4 w-1/2 skeletonLoaderBg animate-pulse mb-2" />
          </div>
        </div>

        <div className="w-full md:w-2/3 md:h-full overflow-auto p-12 overflow-x-hidden shadow-lg rounded-xl">
          <div className="text-center w-full pb-4 h-8 skeletonLoaderBg animate-pulse mb-6" />
          <div className="flex flex-wrap w-full">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="w-1/2 md:w-1/3 lg:w-1/4 aspect-[9/13] relative group md:hover:scale-110 hover:z-30 transition-all duration-100 ease-in-out"
              >
                <div className="relative md:m-2 m-[2px] group-hover:z-30 flex flex-col items-center">
                  <div className="w-full aspect-[9/13] rounded-xl skeletonLoaderBg animate-pulse" />
                  <div className="absolute z-4 bottom-0 p-2 md:p-3 flex flex-col items-center md:group-hover:items-start cards-bg w-full rounded-b-xl">
                    <div className="h-12 w-2/3 skeletonLoaderBg animate-pulse mb-2" />
                    <div className="hidden w-full md:group-hover:block">
                      <div className="h-6 w-3/4 skeletonLoaderBg animate-pulse mb-2" />
                      <div className="h-4 w-full skeletonLoaderBg animate-pulse mb-2" />
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-8 w-8 rounded-md skeletonLoaderBg animate-pulse" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return <p className="text-red-500">Author not found</p>;
  }

  return (
    <div className="flex items-center flex-col md:flex-row w-full md:h-screen">
      <div className="w-full md:w-1/3 md:h-full overflow-auto p-6 md:p-8 lg:p-10 shadow-lg rounded-xl flex flex-col items-center gap-6">
        <Image
          src={author.imageUrl}
          alt={author.fullName}
          width={700}
          height={700}
          className="rounded-lg object-cover w-full h-auto"
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 700))}`}
        />
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{author.fullName}</h1>
          <p className="whitespace-pre-line mt-2">{author.description?.replace(/\\n/g, "\n")}</p>
        </div>
      </div>
      <div className=" w-full md:w-2/3 md:h-full overflow-auto p-12 overflow-x-hidden shadow-lg rounded-xl">
        <h1 className="text-center w-full pb-4">Contents By {author.fullName.split(" ").slice(-1)}</h1>
        <div className="flex flex-wrap w-full">
          {
            authorContent ?
              (authorContent ?? []).map((content) => {

                return (
                  <div key={content.cTitle}
                    className={`w-1/2 md:w-1/3 lg:w-1/4 relative group md:hover:scale-110 hover:z-30 transition-all duration-100 ease-in-out embla__slide sliderBgGroup`} >

                    <div className="relative md:m-2 m-[2px] group-hover:z-30 flex flex-col items-center">

                      <Link href={`/${content.cContentType}/${content.cId}`}>
                        <Image
                          src={content.cPortrait}
                          alt="Responsive Image"
                          width='674'
                          height='1000'
                          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 674))}`}
                          className="rounded-xl object-cover"
                        />
                      </Link>

                      <div className="absolute z-4 bottom-0 p-2 md:p-3 flex flex-col md:group-hover:items-start items-center md:group-hover:animate-slideIn cards-bg w-full rounded-b-xl">
                        <Link className="flex flex-col md:group-hover:items-start items-center" href={`/${content.cContentType}/${content.cId}`}>
                          <Image
                            src={content.cLogo}
                            alt={`${content.cTitle}`}
                            width="1000"
                            height="674"
                            className="!w-2/3 object-cover"
                          />
                        </Link>
                        <div className="hidden w-full md:group-hover:block md:group-hover:animate-slideIn animate-slideOut">
                          <Link href={`/${content.cContentType}/${content.cId}`}>
                            <h1 className="font-bold text-[1vw]">{content.cTitle}</h1>
                            <p className={`text-[.7vw] tooltip tooltip-primary`} data-tip={content.cDescription}>
                              {content.cDescription.length > 50
                                ? content.cDescription.slice(0, 50) + '...'
                                : content.cDescription
                              }
                            </p>
                          </Link>
                          <div className="flex z-40 space-x-1">

                            <Link href={`/${content.cContentType}/${content.cId}`}><button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l">
                              {getInteractIcon(content.cContentType)}
                            </button></Link>

                            <button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l"><IoShareSocialOutline /></button>
                            <button onClick={() => toggleBookmark(content.cId)} className={`btn ${isBookmarked(content.cId) ? 'btn-info' : 'btn-primary'} mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l`}>
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
              <div className="flex items-center justify-center w-full h-full">
                <h1>No Content Yet</h1>
              </div>
          }
        </div>
      </div>
    </div>

  );
}
