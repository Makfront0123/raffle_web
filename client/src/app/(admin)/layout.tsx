
"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hook/useAuth";
import AdminOnlyScreen from "@/components/user/AdminOnlyScreen";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, } = useAuth();
  if (!user || user.role !== "admin") return <AdminOnlyScreen />;

  return <AdminLayout>{children}</AdminLayout>;
}
