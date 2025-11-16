import { connectToMongo } from "@/lib/connectToMongo";
import Note from "@/models/Note";
import User from "@/models/User";
import { NoteInput, noteSchema } from "@/schemas/noteSchema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongo();
    const body = await req.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const { title, content, tags }: NoteInput = parsed.data;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
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
    const existingNote = await Note.findById({ _id: id, userId });
    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    // Save note with edited field
    existingNote.title = title;
    existingNote.content = content;
    existingNote.tags = tags;

    const editedNote = await existingNote.save();

    return NextResponse.json(
      {
        message: "Note updated successfully",
        data: editedNote,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Edit note error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
