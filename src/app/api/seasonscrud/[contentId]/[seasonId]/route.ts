import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

type Params = Promise<{ contentId: string; seasonId: string }>;

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { contentId, seasonId } = await params;
    const { email, ...seasonData } = await req.json();

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

    content.cSeasons[seasonIndex] = { ...content.cSeasons[seasonIndex], ...seasonData };
    content.markModified("cSeasons");
    await content.save();

    return NextResponse.json({ message: "Season updated successfully", content }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    await connectDB();

    const { contentId, seasonId } = await params;
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

    content.cSeasons.splice(seasonIndex, 1);
    content.markModified("cSeasons");
    await content.save();

    return NextResponse.json({ message: "Season deleted successfully", content }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}