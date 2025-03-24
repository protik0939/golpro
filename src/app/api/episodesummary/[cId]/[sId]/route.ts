import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { IEpisode, ISeason } from "@/app/models/types";

export async function GET(req: Request, { params }: { params: { cId: string; sId: string } }) {
    await connectDB();

    const { cId, sId } = await params;

    try {
        const series = await Content.findOne({ cId }, { "cSeasons.cId": 1, "cSeasons.cEpisodes": 1 });
        if (!series) {
            return new Response(JSON.stringify({ message: "Story series not found" }), { status: 404 });
        }

        const season = series.cSeasons.find((season: ISeason) => season.cId === sId);
        if (!season) {
            return new Response(JSON.stringify({ message: "Season not found" }), { status: 404 });
        }

        const episodesSummary = season.cEpisodes.map((ep: IEpisode) => ({
            cId: ep.cId,
            cNo: ep.cNo,
            cTitle: ep.cTitle
        }));

        return new Response(JSON.stringify(episodesSummary), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error }), { status: 500 });
    }
}
