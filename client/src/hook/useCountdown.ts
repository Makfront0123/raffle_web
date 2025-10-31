"use client";

import { useEffect, useState } from "react";

export function useCountdown(expireAt: string) {
  const [timeLeft, setTimeLeft] = useState(() =>
    formatCountdown(getTimeRemaining(expireAt))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(expireAt);

      if (remaining.total <= 0) {
        clearInterval(interval);
        setTimeLeft("Expirada");
      } else {
        setTimeLeft(formatCountdown(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireAt]);

  return timeLeft;
}

export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getTimeRemaining(expireDate: string): TimeRemaining {
  const total = new Date(expireDate).getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

export function formatCountdown(time: TimeRemaining) {
  const { days, hours, minutes, seconds } = time;

  if (time.total <= 0) return "Expirada";
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
