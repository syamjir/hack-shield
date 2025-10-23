import { connectToMongo } from "@/lib/connectToMongo";
import { sendOtp } from "@/lib/sendOtp";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Credentials are required." },
        { status: 400 }
      );
    }
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send Otp
    try {
      await sendOtp(user, "login");
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
      message: `2FA code sent to your ${user.twoFactorMethod}. Please verify to complete login.`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
