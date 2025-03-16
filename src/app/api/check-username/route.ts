
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username } = await req.json();
  await connectDB();

  const user = await User.findOne({ username });
  return NextResponse.json({ available: !user });
}
