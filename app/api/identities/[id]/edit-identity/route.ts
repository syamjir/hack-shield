import { connectToMongo } from "@/lib/connectToMongo";
import Identity from "@/models/Identity";
import User from "@/models/User";
import { IdentityInput, identitySchema } from "@/schemas/identitySchema";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Identity ID is required" },
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
    const existingIdentity = await Identity.findById({ _id: id, userId });
    if (!existingIdentity) {
      return NextResponse.json(
        { error: "Identity not found or unauthorized" },
        { status: 404 }
      );
    }

    // Save password with edited field
    existingIdentity.fullName = fullName;
    existingIdentity.email = email;
    existingIdentity.phone = phone;
    existingIdentity.address = address;
    existingIdentity.city = city;
    existingIdentity.state = state;
    existingIdentity.postalCode = postalCode;
    existingIdentity.country = country;
    existingIdentity.company = company;
    existingIdentity.dateOfBirth = dateOfBirth;
    existingIdentity.notes = notes;

    const editedIdentity = await existingIdentity.save();

    return NextResponse.json(
      {
        message: "Identity updated successfully",
        data: editedIdentity,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Edit Identity error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
