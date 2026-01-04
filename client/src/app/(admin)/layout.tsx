
"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hook/useAuth";
import AdminOnlyScreen from "@/components/user/AdminOnlyScreen";
import AdminMobileBlocked from "@/components/admin/AdminMobileBlocked";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, } = useAuth();
  if (!user || user.role !== "admin") return <AdminOnlyScreen />;

  return (
    <>
      <AdminMobileBlocked />
      <div className="hidden sm:block">
        <AdminLayout>{children}</AdminLayout>;
      </div>
    </>
  )
}
