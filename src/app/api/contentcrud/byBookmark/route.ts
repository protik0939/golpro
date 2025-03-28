import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Bookmark from "@/app/models/Bookmark";
import Content from "@/app/models/Content";
import { connectDB } from "@/app/lib/mongodb";
import { authOptions } from "../../auth/authOptions/authOptions";

export async function GET() {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = session?.user?.email;
        const bookmark = await Bookmark.findOne({ userId });

        if (!bookmark || bookmark.contentIds.length === 0) {
            return NextResponse.json({ message: "No bookmarks found", contents: [] }, { status: 200 });
        }

        // Fetch content details using contentIds
        const contents = await Content.find(
            { cId: { $in: bookmark.contentIds } }, // Filter by contentIds
            { cSeasons: 0 } // Exclude 'cSeasons' field
        )
            .populate("cGenre")
            .populate("cAuthors");

        return NextResponse.json({ contents }, { status: 200 });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
    }
}
