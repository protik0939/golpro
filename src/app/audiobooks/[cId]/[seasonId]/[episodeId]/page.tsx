import Audiobooks from '../../../../audiobooks/(components)/Audiobooks';
import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';
import { IEpisode, ISeason } from '@/app/models/types';
import type { Metadata } from 'next';

export const revalidate = 21600;

export type paramsType = Promise<{ cId: string; seasonId: string; episodeId: string }>;

async function fetchEpisode(cId: string, seasonId: string, episodeId: string) {
  try {
    await connectDB();
    const content = await Content.findOne({ cId });

    if (!content) {
      return null;
    }

    const season: ISeason | undefined = content.cSeasons.find((item: ISeason) => item.cId === seasonId);
    if (!season) {
      return null;
    }

    const episode: IEpisode | undefined = season.cEpisodes.find((item: IEpisode) => item.cId === episodeId);
    return episode ? { content, season, episode } : null;
  } catch (error) {
    console.error('Error fetching audiobook metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
  const { cId, seasonId, episodeId } = await params;
  const data = await fetchEpisode(cId, seasonId, episodeId);

  if (!data) {
    return {
      title: 'Audiobooks | GolPro',
      description: 'GolPro audiobooks and music.',
    };
  }

  return {
    title: `${data.episode.cTitle} | Audiobooks | GolPro`,
    description: data.episode.cDescription || data.content.cDescription || 'GolPro audiobooks and music.',
    openGraph: {
      title: data.episode.cTitle,
      description: data.episode.cDescription || data.content.cDescription || 'GolPro audiobooks and music.',
      images: [
        {
          url: data.episode.cSquare || data.content.cSquare || '/src/app/assets/golproseo.webp',
          width: 1200,
          height: 1200,
          alt: data.episode.cTitle,
        },
      ],
    },
  };
}

export default function Page() {
  return <Audiobooks />;
}