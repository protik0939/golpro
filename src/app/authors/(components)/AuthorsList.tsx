"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import toBase64 from "@/components/ToBasesf";
import shimmer from "@/components/Shimmer";
import Link from "next/link";
import { IAuthor } from "@/app/models/types";

export default function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const { data } = await axios.get("/api/authorscrud/authorGet");
        setAuthors(data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div className="pt-20">
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* Show skeletons while loading */}
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className=" w-full md:w-1/3 lg:w-1/5 p-2 animate-pulse flex flex-col justify-center">
              <div className="w-full h-auto aspect-square skeletonLoaderBg rounded-xl"></div>
            </div>
          ))}

        {!loading &&
          authors.map((author: IAuthor) => (
            <Link key={author.authorId} className="relative flex justify-center w-full md:w-1/3 lg:w-1/5 p-2 cards-bg group" href={`authors/${author.authorId}`}>
              <Image
                src={author.imageUrl}
                alt="Responsive Image"
                width={700}
                height={700}
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 700))}`}
                className="relative rounded-xl object-cover group-hover:border-4 group-hover:border-primary"
              />
              <h1 className="absolute bottom-5 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded">{author.fullName}</h1>
            </Link>
          ))}
      </div>
    </div>
  );
}
