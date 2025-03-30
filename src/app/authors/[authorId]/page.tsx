import React from 'react'
import AuthorPage from './(components)/AuthorPage'
import { connectDB } from '@/app/lib/mongodb';
import Authors from '@/app/models/Authors';
import { Metadata } from 'next';


export type paramsType = Promise<{ authorId: string }>;

async function fetchData(authorId: string) {
  try {
    await connectDB();
    const genre = await Authors.findOne({ authorId });
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
  const { authorId } = await params;
  const data = await fetchData(authorId);

  if (!data) {
    return {
      title: 'GolPro',
    };
  }

  return {
    title: `${data.fullName} | GolPro`,
    description: data.description || 'GolPro is a platform for stories, audiobooks, podcasts, and more.',
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

export default async function page({ params }: { params: paramsType }) {
  const { authorId } = await params;
  return (
    <div className='pt-20'>
      <AuthorPage authorId={authorId} />
    </div>
  )
}
