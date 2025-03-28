import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { IEpisode, ISeason } from "@/app/models/types";

export type paramsType = Promise<{ cId: string; sId: string; eId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {

    try {
        await connectDB();
        const { cId, sId, eId } = await params;
        const series = await Content.findOne({ cId });

        if (!series) {
            return new Response(JSON.stringify({ message: `${cId} Story series not found` }), { status: 404 });
        }

        const season = series.cSeasons.find((season: ISeason) => season.cId === sId);
        if (!season) {
            return new Response(JSON.stringify({ message: "Season not found" }), { status: 404 });
        }

        const episode = season.cEpisodes.find((episode: IEpisode) => episode.cId === eId);
        if (!episode) {
            return new Response(JSON.stringify({ message: "Episode not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(episode), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error }), { status: 500 });
    }
}
