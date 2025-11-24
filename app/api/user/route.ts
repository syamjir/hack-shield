import { connectToMongo } from "@/lib/connectToMongo";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToMongo();
    const userId = req.headers.get("userId");
    // ✅ Check if user exists
    const user = await User.findById(userId).select(
      "-password -verificationCode -verificationExpires"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { data: user, message: "User retrieved successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unhandled user retrieval error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
