"use client";
 
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import RaffleInfo from "@/components/RaffleInfo";
import { useLoadingScreen } from "@/hook/useLoadingScreen";

export default function Home() {
  const loading = useLoadingScreen(300);  

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Hero />
    </>
  );
}
