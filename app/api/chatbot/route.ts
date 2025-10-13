import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message || message.trim().length === 0) {
    console.error("Message cannot be empty");
    return NextResponse.json({ message: "Ask AI something" });
  }

  try {
    const response = await fetch("https://api.cohere.com/v2/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: false,
        model: "command-a-03-2025",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`Cohere request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.message.content[0].text.trim();
    return NextResponse.json({ message: aiResponse });
  } catch (err) {
    console.error("Cohere failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
