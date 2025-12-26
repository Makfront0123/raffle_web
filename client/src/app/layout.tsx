// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RifasApp | Gana premios fácilmente",
  description: "Plataforma de rifas con gestión de usuarios y panel admin",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

        <Script
          src="https://checkout.wompi.co/widget.js"
          strategy="afterInteractive"
        />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

