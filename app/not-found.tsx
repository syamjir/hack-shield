"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-6 text-center">
      <div className="bg-surface-a10 shadow-md rounded-xl px-8 py-10 max-w-md w-full">
        <h1 className="text-5xl font-bold text-primary-a20 mb-4">404</h1>

        <h2 className="text-xl font-semibold text-dark-a0 mb-2">
          Page Not Found
        </h2>

        <p className="text-dark-a0/60 mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <Link
          href="/home"
          className="inline-flex items-center gap-2 bg-primary-a20 hover:bg-primary-a30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
