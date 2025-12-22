"use client";

import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/hook/useAuth";
import UserLayout from "@/layouts/UserLayout";
import { useMounted } from "@/hook/useMounted";

export default function Layout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const { user, initialized } = useAuth();
 
  if (!mounted) {
    return null;
  }

  if (!initialized) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <div>No autenticado</div>;
  }

  if (user.role?.toLowerCase() !== "user") {
    return <div>No autorizado</div>;
  }

  return <UserLayout>{children}</UserLayout>;
}
