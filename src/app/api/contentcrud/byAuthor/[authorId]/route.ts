import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';

export type paramsType = Promise<{ authorId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();
        const { authorId } = await params;
        const content = await Content.find(
            { cAuthors: authorId },
            'cId cTitle cDescription cContentType cLogo cPortrait'
        );

        if (!content.length) {
            return NextResponse.json({ message: 'No content found for this author.' }, { status: 404 });
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('Error fetching content by authorId:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
