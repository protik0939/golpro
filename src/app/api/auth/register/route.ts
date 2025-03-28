
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, name, email, password, dateOfBirth, gender, bio, image } = await req.json();

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ error: "Email already in use" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    name,
    email,
    password: hashedPassword,
    dateOfBirth: dateOfBirth || null,
    gender: gender || null,
    bio: bio || null,
    image: image || null,
    emailVerified: String,
    others: {},
  });

  return NextResponse.json({ success: true, user: newUser });
}
