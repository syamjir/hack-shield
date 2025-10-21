import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Credentials are required" },
        { status: 400 }
      );
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });
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

    // ✅ Set verification code and expires undefined
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // ✅ Create jwt token and save into the cokkie and send back to the client 
    const jwtService = new JwtService(user);
    return jwtService.createSendToken();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
