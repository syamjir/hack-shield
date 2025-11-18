import { connectToMongo } from "@/lib/connectToMongo";
import Card, { ICard } from "@/models/Card";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
    // ✅ Get authenticated userId from middleware
    const userId = req.headers.get("userId");
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch card document
    const cardDoc: ICard = await Card.findById(id).select("+cardNumber");
    if (!cardDoc) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // 🧩 Ensure this Card belongs to the logged-in user
    if (String(cardDoc.userId) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔐 Decrypt the Card
    const plainCardNumber = await cardDoc.getDecryptedCardNumber();

    // create mongoose document object
    const docObject = cardDoc.toObject();
    docObject.cardNumber = plainCardNumber;
    const newData = docObject;
    return NextResponse.json(
      {
        message: "Secret card number retrieved successfully",
        data: newData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Retrieve Card number error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
