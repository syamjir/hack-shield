import { connectToMongo } from "@/lib/connectToMongo";
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
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { email, password }: LoginInput = parsed.data;

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // ✅ Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // ✅ Send 2FA message (simulated or actual)
    return NextResponse.json(
      {
        success: true,
        message: `2FA code sent via ${user.twoFactorMethod}. Please verify to complete login.`,
        twoFactorMethod: user.twoFactorMethod,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
