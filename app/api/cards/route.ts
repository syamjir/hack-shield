import { connectToMongo } from "@/lib/connectToMongo";
import Card from "@/models/Card";
import User from "@/models/User";
import { CardInput, cardSchema } from "@/schemas/cardSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const userId = req.headers.get("userId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the same user already saved the same card credentials
    const existingPassword = await Card.findOne({
      userId,
      cardNumber,
    }).select("+cardNumber");
    const isCardSame = await existingPassword?.compareCard(cardNumber);
    if (existingPassword && isCardSame) {
      return NextResponse.json(
        { error: "This card credential is already saved" },
        { status: 409 }
      );
    }

    // ✅ Create and save new Card entry
    try {
      const newCard = new Card({
        userId: user._id,
        cardHolder: cardHolder.trim(),
        bank: bank.trim(),
        cardNumber: cardNumber.trim(),
        expiryMonth,
        expiryYear,
        cvv: cvv.trim(),
        brand,
      });

      const createdCard = await newCard.save();

      // ✅ avoid leaking sensitive data
      const {
        cardNumber: _,
        ivCard,
        ivCvv,
        ...safeCard
      } = createdCard.toObject();

      return NextResponse.json(
        {
          message: "Card saved successfully",
          data: safeCard,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database save error:", dbError);
      return NextResponse.json(
        { error: "Failed to save Card" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unhandled save card error:", err);
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

    // ✅ Retrieve all cards for the user
    const cards = await Card.find({ userId }).lean();

    // ✅ Return empty array if user has not saved any cards yet
    return NextResponse.json(
      {
        message: "Cards retrieved successfully",
        data: cards || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unhandled cards retrieved error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
