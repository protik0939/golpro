import { connectDB } from "@/app/lib/mongodb";
import Authors from "@/app/models/Authors";

export async function GET() {
    try {
        await connectDB();

        const authors = await Authors.find();

        return new Response(JSON.stringify(authors), {
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
