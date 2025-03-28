import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';

export type paramsType = Promise<{ genreId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();
        const { genreId } = await params;
        const content = await Content.find(
            { cGenre: genreId },
            'cId cTitle cDescription cContentType cLogo cCard'
        );

        if (!content.length) {
            return NextResponse.json({ message: 'No content found for this genre.' }, { status: 404 });
        }

        return NextResponse.json({contents: content});
    } catch (error) {
        console.error('Error fetching content by genreId:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
