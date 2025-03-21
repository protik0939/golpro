import { connectDB } from "@/app/lib/mongodb";
import Genre from "@/app/models/Genre";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
    }

    try {
        const { genreId, genreName, genreDescription, imageUrl, email } = await req.json();

        if (email !== "protik0939@gmail.com") {
            return new Response(JSON.stringify({ message: "Unauthorized: You do not have permission to add authors." }), { status: 403 });
        }

        if (!genreId || !genreName || !genreDescription || !imageUrl) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }
        await connectDB();

        const newAuthor = new Genre({ genreId, genreName, genreDescription, imageUrl });
        await newAuthor.save();

        return new Response(JSON.stringify({ message: "Genre added successfully" }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
