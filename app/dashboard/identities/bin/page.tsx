import { Suspense } from "react";
import IdentitiesBinServer from "./IdentitiesBinServer";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bin-identities",
};

export default async function IdentitiesBinPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500 flex gap-2 items-center">
          <p>Loading bin identities...</p>
          <Spinner />
        </div>
      }
    >
      <IdentitiesBinServer />
    </Suspense>
  );
}
