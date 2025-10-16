 "use client";

import { formatCountdown, getTimeRemaining } from "@/app/utils/formatDate";
import { useEffect, useState } from "react";


export function useCountdown(expireAt: string) {
    const [timeLeft, setTimeLeft] = useState(formatCountdown(expireAt));

    useEffect(() => {
        const interval = setInterval(() => {
            const { total } = getTimeRemaining(expireAt);

            if (total <= 0) {
                clearInterval(interval);
                setTimeLeft("Expirada");
            } else {
                setTimeLeft(formatCountdown(expireAt));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expireAt]);

    return timeLeft;
}
