import { connectToMongo } from "@/lib/connectToMongo";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connectToMongo();

    const body = await req.json();
    const userId = req.headers.get("userId");
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Validate input
    if (body.mode && !["dark", "light"].includes(body.mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }
    if (body.auto_lock !== undefined && typeof body.auto_lock !== "boolean") {
      return NextResponse.json(
        { error: "Invalid auto_lock value" },
        { status: 400 }
      );
    }

    // Update only provided fields
    user.preference = {
      ...user.preference,
      ...(body.mode && { mode: body.mode }),
      ...(body.auto_lock !== undefined && { auto_lock: body.auto_lock }),
    };

    const editedUser = await user.save();

    const { password: _, ...safeUser } = editedUser.toObject();
    return NextResponse.json(
      { message: "Preferences updated successfully", data: safeUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Edit user error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
