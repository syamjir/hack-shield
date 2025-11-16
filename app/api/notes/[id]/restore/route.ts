import { connectToMongo } from "@/lib/connectToMongo";
import Note from "@/models/Note";
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
        { error: "Note ID is required" },
        { status: 400 }
      );
    }
    const restoredNote = await Note.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!restoredNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Note restored successfully",
        data: restoredNote,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error restore Note from bin:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
