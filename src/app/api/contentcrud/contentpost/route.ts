import { connectDB } from "@/app/lib/mongodb";
import Content from "@/app/models/Content";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Parse request data
    const data = await req.json();
    const { emeil, ...contentWithoutEmail } = data; // Extract email, remove from saved data

    // Verify email (replace this logic with your actual verification)
    if (!emeil || emeil !== "protik0939@gmail.com") {
      return NextResponse.json({ error: "Email verification failed" }, { status: 403 });
    }
    const newContent = new Content(contentWithoutEmail);
    await newContent.save();

    return NextResponse.json({ message: "Content created successfully", content: newContent }, { status: 201 });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}
