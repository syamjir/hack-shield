import { Suspense } from "react";
import NotesServer from "./NotesServer";
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
          <p>Loading notes...</p>
          <Spinner />
        </div>
      }
    >
      <NotesServer />
    </Suspense>
  );
}
