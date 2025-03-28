import { connectDB } from "@/app/lib/mongodb";
import Genre from "@/app/models/Genre";

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
