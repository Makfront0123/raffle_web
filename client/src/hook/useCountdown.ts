import { TimeRemaining, getTimeRemaining, formatCountdown } from "@/app/utils/formatDate";
import { useState, useEffect } from "react";

export function useCountdown(expireDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    getTimeRemaining(expireDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(expireDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [expireDate]);

  return formatCountdown(timeLeft);
}