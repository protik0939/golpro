import React from 'react';
import ContentShow from './(components)/ContentShow';
import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';
import type { Metadata } from 'next';

export type paramsType = Promise<{ cId: string }>;


async function fetchData(cId: string) {
  try {
    await connectDB();
    const content = await Content.findOne({ cId });

    if (!content) {
      return null;
    }
    return content;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
  
  const { cId } = await params;
  const data = await fetchData(cId);

  if (!data) {
    return {
      title: 'GolPro',
    };
  }

  return {
    title: `${data.cTitle} | GolPro`,
    description: data.cDescription || 'GolPro is a platform for stories, audiobooks, podcasts, and more.',
    keywords: 'GolPro, story, ebook, audiobooks, podcasts, music, entertainment',
    openGraph: {
      images: [
        {
          url: data.cLandscape || '/src/app/assets/golproseo.webp',
          width: 1200,
          height: 627,
          alt: 'GolPro',
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: paramsType }) {
  const { cId } = await params;
  return <ContentShow cId={cId} />;
}
