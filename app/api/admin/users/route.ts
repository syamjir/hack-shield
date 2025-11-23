import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToMongo } from "@/lib/connectToMongo";

export async function GET(req: Request) {
  try {
    await connectToMongo();
    const userId = req.headers.get("userId");
    const role = req.headers.get("userRole");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate authenticated user
    if (!userId || !role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure caller is admin
    if (role !== "Admin") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    // Fetch all users (securely exclude sensitive fields)
    const users = await User.find().select(
      "-password -verificationCode -verificationExpires"
    );

    return NextResponse.json(
      {
        message: "Users retrieved successfully",
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
