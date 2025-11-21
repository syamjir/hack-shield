import { Suspense } from "react";
import LoginServer from "./LoginsServer";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logins",
};

export default function LoginsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500 flex gap-2 items-center">
          <p>Loading logins...</p>
          <Spinner />
        </div>
      }
    >
      <LoginServer />
    </Suspense>
  );
}
