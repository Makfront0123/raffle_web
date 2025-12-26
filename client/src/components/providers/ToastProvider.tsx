"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand
      toastOptions={{
        classNames: {
          toast:
            "bg-black border border-yellow-500 text-white shadow-xl rounded-xl",
          title: "text-yellow-500 font-semibold",
          description: "text-white/90",
          actionButton:
            "bg-yellow-500text-black font-semibold hover:bg-yellow-500/90",
          cancelButton:
            "bg-white/10 text-white hover:bg-white/20",

          success: "border-yellow-500",
          error: "border-red-500",
          warning: "border-yellow-500",
          info: "border-blue-500",
        },
      }}
    />
  );
}
