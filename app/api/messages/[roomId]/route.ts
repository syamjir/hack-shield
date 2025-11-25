import { connectToMongo } from "@/lib/connectToMongo";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    await connectToMongo();

    const { roomId } = await params;

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "roomId is required" },
        { status: 400 }
      );
    }

    const messages = await Message.find({ room: roomId }).sort({
      createdAt: 1,
    });

    return NextResponse.json(
      {
        message: "Messages retrieved successfully",
        data: messages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error retrieving messages:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
