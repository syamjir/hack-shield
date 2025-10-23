import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import { sendOtp } from "@/lib/sendOtp";
import User from "@/models/User";
import { SignupInput, signupSchema } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();

    // ✅ Input validation
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { email, password, phone, selectedMethod }: SignupInput = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = new User({
      email,
      password,
      phone,
      twoFactorMethod: selectedMethod,
    });

    // Send otp
    try {
      await sendOtp(user, "signup", selectedMethod);
    } catch (err) {
      console.error(`Failed to send verification ${selectedMethod}:`, err);
      return NextResponse.json(
        { error: `Failed to send verification code to your ${selectedMethod}` },
        { status: 500 }
      );
    }

    // Save only after OTP successfully sent
    const createdUser = await user.save();
    const otpToken = new JwtService(createdUser).generateOtpToken();

    return NextResponse.json(
      {
        message: `Verification code sent to your ${selectedMethod}. Please verify to continue.`,
        otpToken,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
