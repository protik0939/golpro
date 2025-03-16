import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import Otp from "@/app/models/Otp";
import { connectDB } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    await connectDB(); // Ensure DB connection

    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    await Otp.findOneAndUpdate(
        { email },
        { otp, expiry },
        { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Verification",
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: "OTP sent successfully" });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
