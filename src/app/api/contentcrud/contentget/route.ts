import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();

    try {
        const url = new URL(req.url);
        const pageParam = Number(url.searchParams.get("page"));
        const limitParam = Number(url.searchParams.get("limit"));
        const shouldPaginate = Number.isFinite(pageParam) && pageParam > 0 && Number.isFinite(limitParam) && limitParam > 0;

        const query = Content.find({}, { cSeasons: 0 })
            .populate("cGenre")
            .populate("cAuthors")
            .sort({ createdAt: -1 });

        if (shouldPaginate) {
            const page = pageParam;
            const limit = limitParam;
            const totalItems = await Content.countDocuments();
            const contents = await query.skip((page - 1) * limit).limit(limit);

            return NextResponse.json(
                {
                    contents,
                    pagination: {
                        page,
                        limit,
                        totalItems,
                        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
                    },
                },
                { status: 200 }
            );
        }

        const contents = await query;
        return NextResponse.json(contents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch contents: ${error}` }, { status: 500 });
    }
}
