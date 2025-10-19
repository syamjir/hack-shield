import { connectToMongo } from "@/lib/connectToMongo";
import EmailService from "@/lib/emailService";
import { JwtService } from "@/lib/jwtService";
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

    const code = user.createVerificationCode();

    // Attempt to send the OTP email first
    const mailService = new EmailService(user, code);

    try {
      await mailService.sendSignupVerificationOtp();
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      return NextResponse.json(
        { error: "Failed to send verification code" },
        { status: 500 }
      );
    }

    // Save only after OTP successfully sent
    const createdUser = await user.save();
    const otpToken = new JwtService(createdUser).generateOtpToken();

    return NextResponse.json({
      message:
        "Verification code sent to your email. Please verify to continue.",
      otpToken,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
