import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    try {
        const contents = await Content.find({ "cSeasons.cEpisodes.cAudioSrc": { $ne: "null" } })

        return NextResponse.json(contents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch contents: ${error}` }, { status: 500 });
    }
}
