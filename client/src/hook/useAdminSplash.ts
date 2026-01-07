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
    if (user.role !== "admin") return;

    const splashShown = sessionStorage.getItem("adminSplashShown") === "true";
    if (splashShown) return;

    setShowSplash(true);
    sessionStorage.setItem("adminSplashShown", "true");

    const timer = setTimeout(() => {
      setShowSplash(false);
      router.push("/dashboard");
    }, duration);

    return () => clearTimeout(timer);
  }, [user, initialized, duration, router]);

  return { showSplash, user };
}
