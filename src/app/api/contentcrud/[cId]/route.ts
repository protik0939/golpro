import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export type paramsType = Promise<{ cId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { cId } = await params;

        const contentId = await Content.findOne({ cId });

        if (!contentId) {
            return new Response(JSON.stringify({ message: "Author not found" }), { status: 404 });
        }

        contentId.cUserVisit = (contentId.cUserVisit || 0) + 1;
        await contentId.save();

        return new Response(JSON.stringify(contentId), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function PUT(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { cId } = await params;
        const data = await req.json();
        const { emeil, cId: bodyContentId, ...contentWithoutEmail } = data;

        if (!emeil || emeil !== "protik0939@gmail.com") {
            return NextResponse.json({ error: "Email verification failed" }, { status: 403 });
        }

        const updatedContent = await Content.findOneAndUpdate(
            { cId },
            { $set: { ...contentWithoutEmail, ...(bodyContentId ? { cId: bodyContentId } : {}) } },
            { new: true, runValidators: true }
        );

        if (!updatedContent) {
            return NextResponse.json({ message: "Content not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Content updated successfully", content: updatedContent },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { cId } = await params;
        const data = await req.json();
        const { emeil } = data;

        if (!emeil || emeil !== "protik0939@gmail.com") {
            return NextResponse.json({ error: "Email verification failed" }, { status: 403 });
        }

        const deletedContent = await Content.findOneAndDelete({ cId });

        if (!deletedContent) {
            return NextResponse.json({ message: "Content not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Content deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting content:", error);
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
    }
}
