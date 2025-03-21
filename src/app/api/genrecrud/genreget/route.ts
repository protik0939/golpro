import { connectDB } from "@/app/lib/mongodb";
import Genre from "@/app/models/Genre";

export async function GET() {
    try {
        await connectDB();
        const genres = await Genre.find();
        return new Response(JSON.stringify(genres), {
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
