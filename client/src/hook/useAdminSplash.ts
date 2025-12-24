"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hook/useAuth";

export function useAdminSplash(duration = 3000) {
  const { user, initialized } = useAuth();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (user?.role !== "admin") return;

    const flag = sessionStorage.getItem("adminSplash");

    if (flag === "true") {
      setShowSplash(true);

      const timer = setTimeout(() => {
        sessionStorage.removeItem("adminSplash");
        setShowSplash(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [initialized, user, duration]);

  return {
    showSplash,
    adminName: user?.name,
  };
}
