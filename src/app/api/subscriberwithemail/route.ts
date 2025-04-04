import { connectDB } from "@/app/lib/mongodb";
import SubscribersEmail from "@/app/models/SubscribersEmail";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
    }

    try {
        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
        }

        const allowedOrigins = [
            "http://localhost:3000",  // For local development
            "https://golpro.vercel.app"  // For Vercel production
        ];
        
        const referer = req.headers.get("referer");
        if (!referer || !allowedOrigins.some((origin) => referer.startsWith(origin))) {
            return new Response(JSON.stringify({ message: "Unauthorized: Invalid Origin" }), { status: 403 });
        }
        

        await connectDB();

        const newSubscriber = new SubscribersEmail({ email });
        await newSubscriber.save();

        return new Response(JSON.stringify({ message: "Subscription successful" }), { status: 201 });
    } catch (error) {
        console.error("Error in subscribing email:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}