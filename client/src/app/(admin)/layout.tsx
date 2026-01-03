"use client";

import { useEffect, useState } from "react";

import LoadingScreen from "@/components/LoadingScreen";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hook/useAuth";
import AdminOnlyScreen from "@/components/user/AdminOnlyScreen";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user || user.role !== "admin") return <AdminOnlyScreen />;

  return <AdminLayout>{children}</AdminLayout>;
}
