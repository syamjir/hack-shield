import { connectToMongo } from "@/lib/connectToMongo";
import Card from "@/models/Card";
import User from "@/models/User";
import { CardInput, cardSchema } from "@/schemas/cardSchema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToMongo();
    const body = await req.json();
    const parsed = cardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const {
      cardHolder,
      bank,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      brand,
    }: CardInput = parsed.data;
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
    // ✅ Ensure card exists
    const existingCard = await Card.findById({ _id: id, userId });
    if (!existingCard) {
      return NextResponse.json(
        { error: "Card not found or unauthorized" },
        { status: 404 }
      );
    }

    // Save Card with edited field
    existingCard.cardHolder = cardHolder;
    existingCard.bank = bank;
    existingCard.cardNumber = cardNumber;
    existingCard.expiryYear = expiryYear;
    existingCard.expiryMonth = expiryMonth;
    existingCard.cvv = cvv;
    existingCard.brand = brand;

    await existingCard.save();

    // ✅ avoid leaking sensitive data
    const {
      cardNumber: _,
      ivCard,
      ivCvv,
      ...safeCard
    } = existingCard.toObject();
    return NextResponse.json(
      {
        message: "Card updated successfully",
        data: safeCard,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Edit Card error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
