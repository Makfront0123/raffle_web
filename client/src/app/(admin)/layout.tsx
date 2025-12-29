
"use client";

import AdminLayout from "@/layouts/AdminLayout";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hook/useAuth";
import AdminOnlyScreen from "@/components/user/AdminOnlyScreen";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user || user.role !== "admin") return <AdminOnlyScreen />;

  return <AdminLayout>{children}</AdminLayout>;
}
