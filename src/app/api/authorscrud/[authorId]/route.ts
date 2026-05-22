import { connectDB } from "@/app/lib/mongodb";
import Authors from "@/app/models/Authors";
import { NextResponse } from "next/server";

export type paramsType = Promise<{ authorId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { authorId } = await params;

        const author = await Authors.findOne({ authorId });

        if (!author) {
            return new Response(JSON.stringify({ message: "Author not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(author), {
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

        const { authorId } = await params;
        const { adminEmail, ...authorData } = await req.json();

        if (adminEmail !== "protik0939@gmail.com") {
            return NextResponse.json({ message: "Unauthorized: You do not have permission to update authors." }, { status: 403 });
        }

        const updatedAuthor = await Authors.findOneAndUpdate(
            { authorId },
            { $set: authorData },
            { new: true, runValidators: true }
        );

        if (!updatedAuthor) {
            return NextResponse.json({ message: "Author not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Author updated successfully", author: updatedAuthor }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { authorId } = await params;
        const { adminEmail } = await req.json();

        if (adminEmail !== "protik0939@gmail.com") {
            return NextResponse.json({ message: "Unauthorized: You do not have permission to delete authors." }, { status: 403 });
        }

        const deletedAuthor = await Authors.findOneAndDelete({ authorId });

        if (!deletedAuthor) {
            return NextResponse.json({ message: "Author not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Author deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
