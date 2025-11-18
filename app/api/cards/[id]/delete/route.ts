import { connectToMongo } from "@/lib/connectToMongo";
import Card from "@/models/Card";
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
        { error: "Card ID is required" },
        { status: 400 }
      );
    }

    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Card deleted successfully",
        data: deletedCard,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error delete Card:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
