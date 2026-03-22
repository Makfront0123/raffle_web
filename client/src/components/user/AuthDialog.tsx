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
      <DialogContent className="max-w-md w-full p-8 bg-[#0b0b0b] border border-[#2a2a2a] text-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold tracking-wide">
            Accede a tu cuenta
          </DialogTitle>

          <p className="text-center text-sm text-gray-400 mt-2">
            Participa en rifas exclusivas y gana premios increíbles
          </p>
        </DialogHeader>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent my-4" />
        <div className="flex flex-col items-center gap-5">

          <Button
            onClick={() => {
              loginWithGoogle();
              onOpenChange(false);
            }}
            className="w-full text-base font-medium
              bg-[#111111]
              border border-yellow-600/40
              text-white
              hover:bg-yellow-600
              hover:text-black
              transition-all duration-300
              rounded-lg
              shadow-md"
          >
            Continuar con Google
          </Button>

          <div ref={googleDivRef} />

          <p className="text-xs text-gray-500 text-center">
            Al continuar aceptas nuestros términos y condiciones
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}