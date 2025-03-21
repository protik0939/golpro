import { connectDB } from '@/app/lib/mongodb';
import Content from '@/app/models/Content';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, contentId, ...contentSeason } = await req.json(); // Use `await req.json()` instead of `req.body`

        // Email verification
        if (!email || email !== "protik0939@gmail.com") {
            return NextResponse.json({ error: "Email verification failed" }, { status: 403 });
        }

        // Validate required fields
        if (!contentId || Object.keys(contentSeason).length === 0) {
            return NextResponse.json({ message: 'Content ID and Season data are required' }, { status: 400 });
        }

        // Find the content
        const content = await Content.findOne({ cId: contentId });

        if (!content) {
            return NextResponse.json({ message: 'Content not found' }, { status: 404 });
        }

        // Ensure cSeasons is an array before pushing new data
        if (!Array.isArray(content.cSeasons)) {
            content.cSeasons = [];
        }

        content.cSeasons.push(contentSeason); // Add season to the array
        await content.save();

        return NextResponse.json({ message: 'Season added successfully', content }, { status: 200 });
    } catch (error) {
        console.error('Error adding season:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
