
import { run } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const x = await run();
    return new NextResponse(`connected! ${x}`);
}