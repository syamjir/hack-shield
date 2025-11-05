import { connectToMongo } from "@/lib/connectToMongo";
import Password from "@/models/Password";
import User from "@/models/User";
import { passwordInput, passwordSchema } from "@/schemas/passwordSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();
    const body = await req.json();
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { site, username, password, websiteUri, strength }: passwordInput =
      parsed.data;

    const userId = req.headers.get("userId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the same user already saved the same login credentials
    const existingPassword = await Password.findOne({
      userId,
      username,
    }).select("+password");
    const isPasswordSame = await existingPassword?.comparePassword(password);
    if (existingPassword && isPasswordSame) {
      return NextResponse.json(
        { error: "This login credential is already saved" },
        { status: 409 }
      );
    }

    // ✅ Create and save new password entry
    try {
      const newPassword = new Password({
        userId: user._id,
        site: site.trim(),
        username: username.trim(),
        password,
        websiteUri: websiteUri?.trim(),
        strength,
      });

      const createdPassword = await newPassword.save();

      return NextResponse.json(
        {
          message: "Password saved successfully",
          password: createdPassword,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database save error:", dbError);
      return NextResponse.json(
        { error: "Failed to save password" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unhandled save password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToMongo();
    const userId = req.headers.get("userId");
    // ✅ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Retrieve all passwords for the user
    const passwords = await Password.find({ userId }).lean();

    // ✅ Return error if user has not saved any passwords yet
    if (passwords.length === 0) {
      return NextResponse.json(
        { error: "No passwords found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Passwords retrieved successfully",
        data: passwords,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/passwords error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
