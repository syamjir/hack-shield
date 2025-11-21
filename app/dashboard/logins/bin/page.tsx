import { Suspense } from "react";
import LoginsBinServer from "./LoginsBinServer";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bin-logins",
};

export default async function LoginsBinPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500 flex gap-2 items-center">
          <p>Loading bin logins...</p>
          <Spinner />
        </div>
      }
    >
      <LoginsBinServer />
    </Suspense>
  );
}
