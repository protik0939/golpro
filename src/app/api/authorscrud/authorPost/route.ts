import { connectDB } from "@/app/lib/mongodb";
import Authors from "@/app/models/Authors";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
    }

    try {
        const { adminEmail, authorId, email: authorEmail, fullName, description, imageUrl, dateOfBirth } = await req.json();

        if (adminEmail !== "protik0939@gmail.com") {
            return new Response(JSON.stringify({ message: "Unauthorized: You do not have permission to add authors." }), { status: 403 });
        }

        if (!authorId || !authorEmail || !fullName || !description || !imageUrl || !dateOfBirth) {
            return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
        }

        await connectDB();

        const newAuthor = new Authors({ authorId, email: authorEmail, fullName, description, imageUrl, dateOfBirth });
        await newAuthor.save();

        return new Response(JSON.stringify({ message: "Author added successfully" }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
