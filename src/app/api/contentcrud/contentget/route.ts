import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    try {
        // Fetch all contents but exclude the 'cSeasons' field
        const contents = await Content.find({}, { cSeasons: 0 })
            .populate("cGenre")
            .populate("cAuthors");

        return NextResponse.json(contents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch contents: ${error}` }, { status: 500 });
    }
}
