"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";

export default function TurnstileCaptcha() {
  const router = useRouter();
  async function verifyToken(token: string) {
    try {
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      console.log("Verification result:", data);
      if (data.success) {
        router.push("/welcome");
      } else {
        alert("CAPTCHA verification failed. Please try again.");
      }
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
