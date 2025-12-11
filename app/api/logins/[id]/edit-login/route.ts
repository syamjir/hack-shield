import { connectToMongo } from "@/lib/connectToMongo";
import { checkBreach } from "@/lib/passwordUtils";
import Password from "@/models/Password";
import User from "@/models/User";
import { passwordInput, passwordSchema } from "@/schemas/passwordSchema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Password ID is required" },
        { status: 400 }
      );
    }
    // ✅ Get authenticated userId from middleware
    const userId = req.headers.get("userId");
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // ✅ Ensure password exists
    const existingPassword = await Password.findById({ _id: id, userId });
    if (!existingPassword) {
      return NextResponse.json(
        { error: "Password not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check password breached before save
    const isBreachedPassword = await checkBreach(password);

    // Save password with edited field
    existingPassword.site = site;
    existingPassword.username = username;
    existingPassword.websiteUri = websiteUri;
    existingPassword.password = password;
    existingPassword.isBreached = isBreachedPassword ? true : false;
    existingPassword.strength = strength;

    await existingPassword.save();

    // ✅ avoid leaking sensitive data
    const { password: _, iv, ...safePassword } = existingPassword.toObject();
    return NextResponse.json(
      {
        message: "Password updated successfully",
        data: safePassword,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Edit password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
