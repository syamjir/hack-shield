import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // ✅ Ensure DB connection
    await connectToMongo();

    // ✅ Parse request body
    const { otp, token } = await req.json();

    if (!otp || !token) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
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

    // ✅ Verify OTP
    const isValidOtp = user.verifyVerificationCode(otp);
    if (!isValidOtp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // ✅ Mark user as verified
    user.twoFactorVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("OTP Verification Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
