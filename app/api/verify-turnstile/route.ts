import { NextResponse } from "next/server";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" });
    }
    const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: token, secret: SECRET_KEY }),
    });
    const data = (await response.json()) as TurnstileResponse;
    return NextResponse.json({ success: data.success, data });
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
