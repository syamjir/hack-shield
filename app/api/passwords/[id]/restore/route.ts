import { connectToMongo } from "@/lib/connectToMongo";
import Password from "@/models/Password";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongo();
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Password ID is required" },
        { status: 400 }
      );
    }
    const restoredPassword = await Password.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!restoredPassword) {
      return NextResponse.json(
        { error: "Password not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Password restored successfully",
        data: restoredPassword,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error restore password from bin:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
