import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import { sendOtp } from "@/lib/sendOtp";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  email: string;
  password: string;
  phone: string;
  selectedMethod: "email" | "phone";
}

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();

    const { email, password, phone, selectedMethod }: RequestBody =
      await req.json();

    if (!email || !password || !phone || !selectedMethod) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      message: `Verification code sent to your ${selectedMethod}. Please verify to continue.`,
      otpToken,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
