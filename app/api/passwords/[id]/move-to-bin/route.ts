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

    const updatedPassword = await Password.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!updatedPassword) {
      return NextResponse.json(
        { error: "Password not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Password moved to bin successfully",
        password: updatedPassword,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error moving password to bin:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
