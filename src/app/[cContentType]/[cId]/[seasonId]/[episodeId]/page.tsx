import React from 'react'
import EpisodePage from './(components)/EpisodePage'
import type { Metadata } from 'next'
import { connectDB } from '@/app/lib/mongodb'
import Content from '@/app/models/Content'
import { IEpisode, ISeason } from '@/app/models/types'

export type paramsType = Promise<{ cId: string; seasonId: string; episodeId: string }>;

async function fetchData(cId: string, seasonId: string, episodeId: string) {
  try {
    await connectDB();
    const series = await Content.findOne({ cId });
    if (!series) {
      console.log(`${cId} Series not found`);
      return null;
    }

    const season: ISeason | undefined = series.cSeasons.find((s: ISeason) => s.cId === seasonId);
    if (!season) {
      console.log(`Season not found`);
      return null;
    }

    const episode: IEpisode | undefined = season.cEpisodes.find((e: IEpisode) => e.cId === episodeId);
    return episode || null;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}


export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
  const { cId, seasonId, episodeId } = await params;
  const data = await fetchData(cId, seasonId, episodeId);

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
          url: data?.cLandscape || '/src/app/assets/golproseo.webp',
          width: 1200,
          height: 627,
          alt: 'GolPro',
        },
      ],
    },
  };
}

export default async function page() {

  return <EpisodePage />;
}
