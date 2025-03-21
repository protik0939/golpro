"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import toBase64 from "@/components/ToBasesf";
import shimmer from "@/components/Shimmer";
import { IAuthor } from "@/app/models/types";

interface AuthorProps {
  readonly authorId: string;
}


export default function AuthorPage({ authorId }: AuthorProps) {
  const [author, setAuthor] = useState<IAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthor = async () => {
      try {
        console.log(authorId);
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

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="w-full h-[300px] bg-gray-300 rounded-xl"></div>
        <div className="mt-2 h-6 w-3/4 bg-gray-300 rounded-md"></div>
      </div>
    );
  }

  if (!author) {
    return <p className="text-red-500">Author not found</p>;
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 shadow-lg rounded-xl flex flex-col md:flex-row items-center gap-6">
      <Image
        src={author.imageUrl}
        alt={author.fullName}
        width={700}
        height={700}
        className="rounded-lg object-cover w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 700))}`}
      />
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">{author.fullName}</h1>
        <p className="whitespace-pre-line mt-2">{author.description}</p>
      </div>
    </div>

  );
}
