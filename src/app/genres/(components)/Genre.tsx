"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import toBase64 from "@/components/ToBasesf";
import shimmer from "@/components/Shimmer";
import Link from "next/link";
import { IGenre } from "@/app/models/types";

export default function Genre() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await axios.get("/api/genrecrud/genreget");
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="pt-20">
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* Show skeletons while loading */}
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-1/5 p-2 animate-pulse flex flex-col justify-center">
              <div className="w-full h-auto aspect-video skeletonLoaderBg rounded-xl"></div>
            </div>
          ))}

        {!loading &&
          genres.map((genre: IGenre) => (
            <Link key={genre.genreId} className="relative flex justify-center w-full md:w-1/3 lg:w-1/5 p-2 cards-bg group" href={`genres/${genre.genreId}`}>
              <Image
                src={genre.imageUrl}
                alt={genre.genreName}
                width={480}
                height={270}
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(480, 270))}`}
                className="relative rounded-xl object-cover group-hover:border-4 group-hover:border-primary"
                onError={(e) => (e.currentTarget.src = '/src/app/assets/errorload/cardLoad.webp')}
              />
              <h1 className="absolute bottom-5 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded">{genre.genreName}</h1>
            </Link>
          ))}
      </div>
    </div>
  );
}
