import { connectDB } from "@/app/lib/mongodb";
import Authors from "@/app/models/Authors";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
    }

    try {
        const { authorId, fullName, description, imageUrl, email } = await req.json();

        if (email !== "protik0939@gmail.com") {
            return new Response(JSON.stringify({ message: "Unauthorized: You do not have permission to add authors." }), { status: 403 });
        }

        if (!authorId || !fullName || !description || !imageUrl) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        await connectDB();

        const newAuthor = new Authors({ authorId, fullName, description, imageUrl });
        await newAuthor.save();

        return new Response(JSON.stringify({ message: "Author added successfully" }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
