import React from 'react'
import SeasonsPage from './(components)/SeasonsPage'
import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';
import { ISeason } from '@/DummyApi/typeScript';
import { Metadata } from 'next';

export type paramsType = Promise<{ cId: string; seasonId: string }>;

async function fetchData(cId: string, seasonId: string) {
    try {
        await connectDB();
        const series = await Content.findOne({ cId });
        if (!series) {
            console.log(`${cId} Series not found`);
            return null;
        }

        const season: ISeason | undefined = series.cSeasons.find((s: ISeason) => s.cId === seasonId);
        return season || null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
    const { cId, seasonId } = await params;
    const data = await fetchData(cId, seasonId);
    console.log('fetched data: ', data);

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

export default function page() {
    return (
        <div className='pt-20'>
            <SeasonsPage />
        </div>
    )
}
