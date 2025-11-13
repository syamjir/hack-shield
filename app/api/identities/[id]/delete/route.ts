import { connectToMongo } from "@/lib/connectToMongo";
import Identity from "@/models/Identity";
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
        { error: "Identity ID is required" },
        { status: 400 }
      );
    }

    const deletedIdentity = await Identity.findByIdAndDelete(id);

    if (!deletedIdentity) {
      return NextResponse.json(
        { error: "Identity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Identity deleted successfully",
        data: deletedIdentity,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error delete Identity:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
