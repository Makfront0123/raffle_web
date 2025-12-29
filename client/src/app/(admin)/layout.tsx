"use client";

import { useEffect, useState } from "react";

import LoadingScreen from "@/components/LoadingScreen";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hook/useAuth";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return <LoadingScreen />;

  if (!user || user.role !== "admin") {
    return <div>No autorizado</div>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
