import { notFound } from "next/navigation";

// This triggers the dashboard's not-found.tsx
export default function CatchAll() {
  notFound();
  return null;
}
