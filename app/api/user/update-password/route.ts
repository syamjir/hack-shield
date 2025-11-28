import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();

    const { currentPassword, newPassword } = await req.json();
    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // ✅ Find user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // ✅ Check password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Your current password is wrong." },
        { status: 401 }
      );
    }

    user.password = newPassword;
    //  Save the newly password to the database
    const savedUser = await user.save();
    // ✅ Create jwt token and save into the cokkie and send back to the client
    const jwtService = new JwtService(savedUser);
    return jwtService.createSendToken("Password reset successful");
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
