
"use client";

import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hook/useAuth";
import AdminOnlyScreen from "@/components/user/AdminOnlyScreen";
import AdminMobileBlocked from "@/components/admin/AdminMobileBlocked";
import { AdminWelcomeModal } from "@/components/admin/AdminWelcomeModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, } = useAuth();
  if (!user || user.role !== "admin") return <AdminOnlyScreen />;

  return (
    <>
      <AdminMobileBlocked />
      <div className="hidden sm:block">
        <AdminLayout>
          <AdminWelcomeModal />
          {children}
        </AdminLayout>;
      </div>
    </>
  )
}
