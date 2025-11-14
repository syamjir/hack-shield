import { Suspense } from "react";
import IdentitiesServer from "./IdentitiesServer";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identities",
};

export default function IdentitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500 flex gap-2 items-center">
          <p>Loading identities...</p>
          <Spinner />
        </div>
      }
    >
      <IdentitiesServer />
    </Suspense>
  );
}
