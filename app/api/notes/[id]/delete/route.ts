import { connectToMongo } from "@/lib/connectToMongo";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
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

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Note deleted successfully",
        data: deletedNote,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error delete note:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
