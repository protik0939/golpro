import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';
import { ISeason } from '@/app/models/types';

export type paramsType = Promise<{ cContentType: string; cId: string; cSeasons: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();
        const { cContentType, cId, cSeasons } = await params;
        console.log(cContentType, cId, cSeasons);
        const series = await Content.findOne({ cId });
        if (!series) {
            return NextResponse.json({ message: 'Content not found for the given cContentType and cId.' }, { status: 404 });
        }
        const season = series.cSeasons.find((season: ISeason) => season.cId === cSeasons);
        if (!season) {
            return new Response(JSON.stringify({ message: "Season not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ season, cContentType: series.cContentType, contentId: series.cId }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error('Error fetching seasons:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
