"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (phone: string) => void;
}
export function PhoneDialog({ open, onClose, onSubmit }: Props) {
    const [phone, setPhone] = useState("");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#0B0B0B] text-white border border-yellow-500/30">
                <DialogHeader>
                    <DialogTitle className="text-yellow-400 text-xl">Agregar número de teléfono</DialogTitle>
                </DialogHeader>

                <p className="text-gray-300">
                    Necesitamos tu número para completar tu cuenta y permitir pagos por Nequi/Daviplata.
                </p>

                <input
                    type="text"
                    placeholder="3001234567"
                    className="w-full mt-4 p-3 rounded bg-black/40 border border-yellow-500/20 text-white"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <Button
                    onClick={() => onSubmit(phone)}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full"
                >
                    Guardar
                </Button>
            </DialogContent>
        </Dialog>
    );
}
