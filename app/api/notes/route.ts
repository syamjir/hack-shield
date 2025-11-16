import { connectToMongo } from "@/lib/connectToMongo";
import Note from "@/models/Note";
import User from "@/models/User";
import { NoteInput, noteSchema } from "@/schemas/noteSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const userId = req.headers.get("userId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Create and save new password entry
    try {
      const newNote = new Note({
        userId: user._id,
        title: title.trim(),
        content: content.trim(),
        tags,
      });

      const createdNote = await newNote.save();

      return NextResponse.json(
        {
          message: "Password saved successfully",
          data: createdNote,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database save error:", dbError);
      return NextResponse.json(
        { error: "Failed to save note" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unhandled save note error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToMongo();
    const userId = req.headers.get("userId");
    // ✅ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Retrieve all notes for the user
    const notes = await Note.find({ userId }).lean();

    // ✅ Return empty array if user has not saved any notes yet
    return NextResponse.json(
      {
        message: "Notes retrieved successfully",
        data: notes || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
