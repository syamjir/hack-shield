import { Suspense } from "react";
import CardsBinServer from "./CardsBinServer";
import { Spinner } from "@/components/ui/spinner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bin-identities",
};

export default async function CardsBinPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-gray-500 flex gap-2 items-center">
          <p>Loading bin cards...</p>
          <Spinner />
        </div>
      }
    >
      <CardsBinServer />
    </Suspense>
  );
}
