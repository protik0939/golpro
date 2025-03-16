
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  await connectDB();
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { username, password: hashedPassword },
    { new: true }
  );

  return NextResponse.json({ success: true, user: updatedUser });
}
