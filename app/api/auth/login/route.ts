import { connectToMongo } from "@/lib/connectToMongo";
import { sendOtp } from "@/lib/sendOtp";
import User from "@/models/User";
import { LoginInput, loginSchema } from "@/schemas/loginSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();

    const body = await req.json();
    // ✅ Input validation
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error.issues[0].message);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }
    const { email, password }: LoginInput = parsed.data;
    console.log(email, password);

    // ✅ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // ✅ Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // ✅ Send otp
    try {
      await sendOtp(user, "login");
    } catch (err) {
      console.error(
        `Failed to send 2FA code to your ${user.twoFactorMethod}:`,
        err
      );
      return NextResponse.json(
        {
          error: `Failed to send 2FA code code to your ${user.twoFactorMethod}`,
        },
        { status: 500 }
      );
    }
    //  Save the newly created OTP to the database
    await user.save();

    // ✅ Send 2FA message (simulated or actual)
    return NextResponse.json(
      {
        message: `2FA code sent via ${user.twoFactorMethod}. Please verify to complete login.`,
        twoFactorMethod: user.twoFactorMethod,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
