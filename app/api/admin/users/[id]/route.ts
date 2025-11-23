import { connectToMongo } from "@/lib/connectToMongo";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongo();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // CHECK ADMIN
    const adminCheck = await verifyAdminRequest(req);
    if (adminCheck.error) return adminCheck.error;

    // GET TARGET USER
    const result = await findTargetUser(id);
    if (result.error) return result.error;

    const targetUser = await User.findById(id).select(
      "-password -verificationCode -verificationExpires"
    );

    return NextResponse.json(
      {
        message: "User retrieved successfully",
        data: targetUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error retrieving user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToMongo();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // CHECK ADMIN
    const adminCheck = await verifyAdminRequest(req);
    if (adminCheck.error) return adminCheck.error;

    // GET TARGET USER
    const result = await findTargetUser(id);
    if (result.error) return result.error;

    const targetUser = result.targetUser;

    // BLOCK deleting ANY admin
    if (targetUser.role === "Admin") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted" },
        { status: 403 }
      );
    }

   const deletedUser= await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User deleted successfully" ,data:deletedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// --------------------------------------------------------------------
// Helper functions

async function verifyAdminRequest(req: Request) {
  const userId = req.headers.get("userId");
  const role = req.headers.get("userRole");

  if (!userId || !role) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (role !== "Admin") {
    return {
      error: NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      ),
    };
  }

  return { userId, role };
}

async function findTargetUser(id: string) {
  const targetUser = await User.findById(id);
  if (!targetUser) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }
  return { targetUser };
}
