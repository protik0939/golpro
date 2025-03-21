import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, contentId, seasonId, ...contentEpisode } = await req.json();

        // Email verification
        if (!email || email !== "protik0939@gmail.com") {
            return NextResponse.json({ error: "Email verification failed" }, { status: 403 });
        }

        // Validate required fields
        if (!contentId || !seasonId || Object.keys(contentEpisode).length === 0) {
            return NextResponse.json({ message: 'Content ID, Season ID, and Episode data are required' }, { status: 400 });
        }

        // Find the content
        const content = await Content.findOne({ cId: contentId });
        if (!content) {
            return NextResponse.json({ message: 'Content not found' }, { status: 404 });
        }

        // Find the season within the content
        const seasonIndex = content.cSeasons.findIndex((s: { cId: string }) => s.cId === seasonId);
        if (seasonIndex === -1) {
            return NextResponse.json({ message: 'Season not found' }, { status: 404 });
        }

        // Ensure cEpisodes is an array before pushing new data
        if (!Array.isArray(content.cSeasons[seasonIndex].cEpisodes)) {
            content.cSeasons[seasonIndex].cEpisodes = [];
        }

        content.cSeasons[seasonIndex].cEpisodes.push(contentEpisode); // Add episode

        content.markModified(`cSeasons.${seasonIndex}.cEpisodes`);
        await content.save();

        return NextResponse.json({ message: 'Episode added successfully',seasonIndex, content }, { status: 200 });
    } catch (error) {
        console.error('Error adding episode:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}