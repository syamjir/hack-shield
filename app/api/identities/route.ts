import { connectToMongo } from "@/lib/connectToMongo";
import Identity from "@/models/Identity";
import User from "@/models/User";
import { IdentityInput, identitySchema } from "@/schemas/identitySchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();
    const body = await req.json();
    const parsed = identitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      company,
      dateOfBirth,
      notes,
    }: IdentityInput = parsed.data;

    const userId = req.headers.get("userId");
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Create and save new identity entry
    try {
      const newIdentity = new Identity({
        userId: user._id,
        fullName,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        company,
        dateOfBirth,
        notes,
      });

      const createdIdentity = await newIdentity.save();
      return NextResponse.json(
        {
          message: "Password saved successfully",
          data: createdIdentity,
        },
        { status: 201 }
      );
    } catch (err) {
      console.error("Database save error:", err);
      return NextResponse.json(
        { error: "Failed to save password" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Unhandled save Identity error:", err);
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

    // ✅ Retrieve all passwords for the user
    const identities = await Identity.find({ userId }).lean();

    // ✅ Return empty array if user has not saved any identities yet
    return NextResponse.json(
      {
        message: "Identities retrieved successfully",
        data: identities || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/identities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
