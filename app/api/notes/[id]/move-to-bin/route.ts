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

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Note moved to bin successfully",
        data: updatedNote,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error moving note to bin:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
