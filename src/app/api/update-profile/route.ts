import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function PUT(req: Request) {
    try {
        const {username, email, name, dateOfBirth, bio, gender, image } = await req.json();
        
        await connectDB(); // Ensure the database is connected

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { username, name, bio, dateOfBirth, gender, image },
            { new: true } // Return the updated document
        );
        console.log(updatedUser);
        return NextResponse.json({ message: "Profile updated", user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating profile", error }, { status: 500 });
    }
}
