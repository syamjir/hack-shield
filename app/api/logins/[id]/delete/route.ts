import { connectToMongo } from "@/lib/connectToMongo";
import Password from "@/models/Password";
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
        { error: "Password ID is required" },
        { status: 400 }
      );
    }

    const deletedPassword = await Password.findByIdAndDelete(id);

    if (!deletedPassword) {
      return NextResponse.json(
        { error: "Password not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Password deleted successfully",
        data: deletedPassword,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error delete password:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
