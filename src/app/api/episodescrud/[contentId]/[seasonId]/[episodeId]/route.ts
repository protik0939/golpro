import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

type Params = Promise<{ contentId: string; seasonId: string; episodeId: string }>;

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { contentId, seasonId, episodeId } = await params;
    const { email, ...episodeData } = await req.json();

    if (email !== "protik0939@gmail.com") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const content = await Content.findOne({ cId: contentId });
    if (!content) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    const seasonIndex = content.cSeasons.findIndex((season: { cId: string }) => season.cId === seasonId);
    if (seasonIndex === -1) {
      return NextResponse.json({ message: "Season not found" }, { status: 404 });
    }

    const episodeIndex = content.cSeasons[seasonIndex].cEpisodes.findIndex((episode: { cId: string }) => episode.cId === episodeId);
    if (episodeIndex === -1) {
      return NextResponse.json({ message: "Episode not found" }, { status: 404 });
    }

    content.cSeasons[seasonIndex].cEpisodes[episodeIndex] = {
      ...content.cSeasons[seasonIndex].cEpisodes[episodeIndex],
      ...episodeData,
    };
    content.markModified(`cSeasons.${seasonIndex}.cEpisodes`);
    await content.save();

    return NextResponse.json({ message: "Episode updated successfully", content }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { contentId, seasonId, episodeId } = await params;
    const { email } = await req.json();

    if (email !== "protik0939@gmail.com") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const content = await Content.findOne({ cId: contentId });
    if (!content) {
      return NextResponse.json({ message: "Content not found" }, { status: 404 });
    }

    const seasonIndex = content.cSeasons.findIndex((season: { cId: string }) => season.cId === seasonId);
    if (seasonIndex === -1) {
      return NextResponse.json({ message: "Season not found" }, { status: 404 });
    }

    const episodeIndex = content.cSeasons[seasonIndex].cEpisodes.findIndex((episode: { cId: string }) => episode.cId === episodeId);
    if (episodeIndex === -1) {
      return NextResponse.json({ message: "Episode not found" }, { status: 404 });
    }

    content.cSeasons[seasonIndex].cEpisodes.splice(episodeIndex, 1);
    content.markModified(`cSeasons.${seasonIndex}.cEpisodes`);
    await content.save();

    return NextResponse.json({ message: "Episode deleted successfully", content }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}