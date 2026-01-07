"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hook/useAuth";

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { loginWithGoogle } = useAuth();
  const googleDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id && googleDivRef.current) {
      window.google.accounts.id.renderButton(googleDivRef.current, {
        theme: "outline",
        size: "large",
      });

      googleDivRef.current.style.display = "none";
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[1vh] p-8 bg-[#0f172a] border border-[#334155] text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold mb-6">
            Iniciar Sesión
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={() => {
              loginWithGoogle();
              onOpenChange(false);
            }}
            className="w-full bg-gradient-to-r from-purple-700 to-blue-500 hover:from-blue-500 hover:to-purple-700 text-lg"
          >
            Continuar con Google
          </Button>

          <div ref={googleDivRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
