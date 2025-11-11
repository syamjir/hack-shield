import { Suspense } from "react";
import IdentityServer from "./IdentitiesServer";

export default function IdentitiesPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-gray-500">Loading identities...</div>}
    >
      <IdentityServer />
    </Suspense>
  );
}
