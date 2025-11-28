"use client";

import { useEffect, useRef } from "react";

export function useAutoLock(
  enabled: boolean,
  timeoutMinutes: number,
  onLock: () => void
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset the inactivity timer
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (enabled) {
      timerRef.current = setTimeout(() => {
        onLock(); // lock the app
      }, timeoutMinutes * 60 * 1000);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // User activity events
    const activityEvents = ["mousemove", "keydown", "click", "touchstart"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // Start timer initially
    resetTimer();

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, timeoutMinutes]);
}
