import { connectToMongo } from "@/lib/connectToMongo";
import Card from "@/models/Card";
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
        { error: "Card ID is required" },
        { status: 400 }
      );
    }
    const restoredCard = await Card.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!restoredCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Card restored successfully",
        data: restoredCard,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error restore card:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
