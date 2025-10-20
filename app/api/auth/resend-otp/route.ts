import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import { sendOtp } from "@/lib/sendOtp";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // ✅ Decode JWT token to extract user ID
    let decoded;
    try {
      const jwtService = new JwtService();
      decoded = await jwtService.decodeJwtToken(token);
    } catch (err) {
      console.error("❌ JWT decode failed:", err);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ✅ Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Send Otp
    try {
      await sendOtp(user, "signup");
      await user.save({ validateBeforeSave: false });
    } catch (err) {
      console.error(`Failed to send otp to your ${user.twoFactorMethod}:`, err);
      return NextResponse.json(
        {
          error: `Failed to send otp to your ${user.twoFactorMethod}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Verification code sent to your ${user.twoFactorMethod}. Please verify to continue.`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
