"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  message?: string;
}

export default function Error({ error, reset, message }: ErrorStateProps) {
  useEffect(() => {
    if (error) console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex flex-col items-center justify-center gap-3">
        <AlertTriangle className="w-12 h-12 text-anger-a0" />
        <h2 className="text-lg font-semibold text-dark-a0">
          Something went wrong
        </h2>
        <p className="text-sm text-dark-a0/70 max-w-md">
          {message ||
            error?.message ||
            "An unexpected error occurred. Please try again."}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        {reset && (
          <Button
            onClick={() => reset()}
            className="bg-primary-a20 hover:bg-primary-a30 text-white flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}

        <Button
          onClick={() => (window.location.href = "/home")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
