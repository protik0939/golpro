import { connectDB } from "@/app/lib/mongodb";
import Authors from "@/app/models/Authors";

export async function GET(req: Request, { params }: { params: { authorId: string } }) {
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
