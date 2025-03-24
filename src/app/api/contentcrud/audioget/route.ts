import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    try {
        const contents = await Content.find(
            { "cSeasons.cEpisodes.cAudioSrc": { $ne: "null" } },
            {
                "cSeasons.cEpisodes.cTitle": 1,
                "cSeasons.cEpisodes.cSquare": 1,
                "cSeasons.cEpisodes.cAuthors": 1,
                "cSeasons.cEpisodes.cGenre": 1,
                "cSeasons.cEpisodes.cAudioSrc": 1,
                "cAuthors": 1,
                "cGenre": 1,
                "cSquare": 1,
                "cId": 1,
                "cDescription": 1,
                "cTitle": 1,
                _id: 0
            }
        ).populate("cSeasons.cEpisodes.cGenre")
         .populate("cSeasons.cEpisodes.cAuthors");

        return NextResponse.json(contents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch contents: ${error}` }, { status: 500 });
    }
}
