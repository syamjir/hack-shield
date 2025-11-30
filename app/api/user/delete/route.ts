import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectToMongo();
    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Soft delete the user
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // send logout token
    const jwtService = new JwtService(deletedUser);
    return jwtService.createSendLogOutToken(
      "User deleted successfully. Logging out..."
    );
  } catch (err) {
    console.error("Error delete user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
