import { connectToMongo } from "@/lib/connectToMongo";
import { JwtService } from "@/lib/jwtService";
import Password from "@/models/Password";
import User from "@/models/User";
import { passwordInput, passwordSchema } from "@/schemas/passwordSchema";
import { cookies } from "next/headers";
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

    // ✅ Get JWT from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    // ✅ Decode JWT and find user
    let decoded;
    try {
      const jwtService = new JwtService();
      decoded = await jwtService.decodeJwtToken(token);
    } catch (err) {
      console.error("JWT decode failed:", err);
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
          data: createdPassword,
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
