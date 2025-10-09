"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export default function TurnstileCaptcha() {
  async function verifyToken(token: string) {
    try {
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      console.log("Verification result:", data);
    } catch (err) {
      console.error("Turnstile verification failed:", err);
    }
  }

  return (
    <div>
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
        onSuccess={(token) => verifyToken(token)}
      />
    </div>
  );
}
