"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";

export function useAdminSplash(duration = 1500) {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!initialized || !user) return;

    const splashShown = sessionStorage.getItem("adminSplashShown") === "true";
    const justLoggedIn = sessionStorage.getItem("justLoggedIn") === "true";
    if (user.role === "admin" && !splashShown && !justLoggedIn) {
      setShowSplash(true);
      sessionStorage.setItem("justLoggedIn", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("adminSplashShown", "true");
        sessionStorage.removeItem("justLoggedIn");
        router.push("/dashboard");
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [user, initialized, duration, router]);

  return { showSplash, user };
}
