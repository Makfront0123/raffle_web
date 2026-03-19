import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { PageTransitionProvider } from "./providers/page_transition_provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RifasApp | Gana premios fácilmente",
  description: "Plataforma de rifas con gestión de usuarios y panel admin",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-black`} suppressHydrationWarning>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        <Script
          src="https://checkout.wompi.co/widget.js"
          strategy="afterInteractive"
        />
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>

        <ToastProvider />
      </body>
    </html>
  );
}

