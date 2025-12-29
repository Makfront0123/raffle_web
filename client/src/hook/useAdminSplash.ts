"use client";

import { useEffect, useState } from "react";
import { AuthStore } from "@/store/authStore";

export function useAdminSplash() {
  const { user } = AuthStore();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const shown = sessionStorage.getItem("adminSplashShown");

    if (!shown) {
      sessionStorage.setItem("adminSplashShown", "true");
      setShowSplash(true);
    }
  }, [user]);

  return {
    showSplash,
    adminName: user?.name,
  };
}
