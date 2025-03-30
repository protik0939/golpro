import React from 'react';
import AGenre from './(components)/AGenre';
import { connectDB } from '@/app/lib/mongodb';
import Genre from '@/app/models/Genre';
import type { Metadata } from 'next';

export type paramsType = Promise<{ genreId: string }>;

async function fetchData(genreId: string) {
  try {
    await connectDB();
    const genre = await Genre.findOne({ genreId });
    if (!genre) {
      return null;
    }
    return genre;
  } catch (error) {
    console.error("Error fetching genre:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
  const { genreId } = await params;
  const data = await fetchData(genreId);

  if (!data) {
    return {
      title: 'GolPro',
    };
  }

  return {
    title: `${data.genreName} | GolPro`,
    description: data.genreDescription || 'GolPro is a platform for stories, audiobooks, podcasts, and more.',
    keywords: 'GolPro, story, ebook, audiobooks, podcasts, music, entertainment',
    openGraph: {
      images: [
        {
          url: data.imageUrl || '/src/app/assets/golproseo.webp',
          width: 1024,
          height: 1024,
          alt: 'GolPro',
        },
      ],
    },
  };
}

export default async function Page({params}: { params: paramsType }) {
  
  const { genreId } = await params;
  return (
    <div className="pt-20">
      <AGenre genreId={genreId} />
    </div>
  );
}
