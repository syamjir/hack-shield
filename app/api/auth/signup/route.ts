import { connectToMongo } from "@/lib/connectToMongo";
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

    // Validate required fields
    if (!email || !password || !phone || !selectedMethod) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password is automatically done in User pre hook

    // Create user
    const user = new User({
      email,
      password,
      twoFactorMethod: selectedMethod,
    });

    // Generate verification code
    const code = user.createVerificationCode();
    await user.save();

    //  TODO: Send code via email or SMS based on twoFactorMethod
    return NextResponse.json(
      { message: "Signup successful, , verification code sent" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
