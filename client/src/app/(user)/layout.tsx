"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hook/useAuth";
import UserLayout from "@/layouts/UserLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

 
  if (!user) return <div>No autorizado</div>;
 
  if (user.role?.toLowerCase() !== "user") return <div>No autorizado</div>;

  return <UserLayout>{children}</UserLayout>;
}
