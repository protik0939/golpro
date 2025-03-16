import { connectDB } from "@/app/lib/mongodb";
import Otp from "@/app/models/Otp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();

    const { email, otp } = await req.json();
    if (!email || !otp) {
        return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const record = await Otp.findOne({ email });
    if (!record || record.otp !== otp || new Date() > new Date(record.expiry)) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // OTP is valid, delete it and proceed with user registration
    await Otp.deleteOne({ email });

    return NextResponse.json({ success: "OTP verified successfully" });
}
