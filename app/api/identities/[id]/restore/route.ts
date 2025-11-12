import { connectToMongo } from "@/lib/connectToMongo";
import Identity from "@/models/Identity";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongo();
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Identity ID is required" },
        { status: 400 }
      );
    }
    const restoredIdentity = await Identity.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!restoredIdentity) {
      return NextResponse.json(
        { error: "Identity not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Identity restored successfully",
        data: restoredIdentity,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error restore Identity from bin:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
