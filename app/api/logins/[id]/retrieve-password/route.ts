import { connectToMongo } from "@/lib/connectToMongo";
import Password, { IPassword } from "@/models/Password";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongo();
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

    // ✅ Fetch password document
    const passwordDoc: IPassword = await Password.findById(id).select(
      "+password"
    );
    if (!passwordDoc) {
      return NextResponse.json(
        { error: "Password not found" },
        { status: 404 }
      );
    }

    // 🧩 Ensure this password belongs to the logged-in user
    if (String(passwordDoc.userId) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔐 Decrypt the password
    const plainTextPassword = await passwordDoc.decryptPassword(
      passwordDoc.password
    );

    // create mongoose document object
    const docObject = passwordDoc.toObject();
    docObject.password = plainTextPassword;
    const newData = docObject;
    return NextResponse.json(
      {
        message: "Password retrieved successfully",
        data: newData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Retrieve password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
