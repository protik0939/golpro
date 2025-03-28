import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";

export type paramsType = Promise<{ cId: string }>;

export async function GET(req: Request, { params }: { params: paramsType }) {
    try {
        await connectDB();

        const { cId } = await params;

        const contentId = await Content.findOne({ cId });

        if (!contentId) {
            return new Response(JSON.stringify({ message: "Author not found" }), { status: 404 });
        }

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
