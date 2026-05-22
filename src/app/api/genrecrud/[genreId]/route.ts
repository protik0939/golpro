import { connectDB } from "@/app/lib/mongodb";
import Genre from "@/app/models/Genre";
import { NextResponse } from "next/server";

export type paramsType = Promise<{ genreId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { genreId } = await params;

        const genre = await Genre.findOne({ genreId });

        if (!genre) {
            return new Response(JSON.stringify({ message: "Author not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(genre), {
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

        const { genreId } = await params;
        const { email, ...genreData } = await req.json();

        if (email !== "protik0939@gmail.com") {
            return NextResponse.json({ message: "Unauthorized: You do not have permission to update genres." }, { status: 403 });
        }

        const updatedGenre = await Genre.findOneAndUpdate(
            { genreId },
            { $set: genreData },
            { new: true, runValidators: true }
        );

        if (!updatedGenre) {
            return NextResponse.json({ message: "Genre not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Genre updated successfully", genre: updatedGenre }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { genreId } = await params;
        const { email } = await req.json();

        if (email !== "protik0939@gmail.com") {
            return NextResponse.json({ message: "Unauthorized: You do not have permission to delete genres." }, { status: 403 });
        }

        const deletedGenre = await Genre.findOneAndDelete({ genreId });

        if (!deletedGenre) {
            return NextResponse.json({ message: "Genre not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Genre deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
