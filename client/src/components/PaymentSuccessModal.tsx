"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWhatsappReceipt } from "@/hook/useSendWhatsappReceipt";
interface Props {
  open: boolean;
  onClose: () => void;
  raffleName?: string;
  tickets?: string[];
  amount: number;
}

export function PaymentSuccessModal({
  open,
  onClose,
  raffleName,
  tickets,
  amount,
}: Props) {
  const [phone, setPhone] = useState("");
  const { sendReceipt, loading, sent } = useWhatsappReceipt();

  const handleSendReceipt = async () => {
    if (!phone || !raffleName || !tickets || tickets.length === 0) return;

    try {
      await sendReceipt({
        phone,
        raffleName,
        tickets,
        amount,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0B0B0B] border border-yellow-500/20 text-white max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Pago exitoso</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center text-center gap-5 py-6">
          <CheckCircle className="w-20 h-20 text-yellow-400" />
          <h2 className="text-2xl font-extrabold">¡Compra exitosa!</h2>
          <p className="text-gray-300">Tu pago fue procesado correctamente.</p>

          {!sent ? (
            <div className="w-full mt-4 space-y-3">
              <p className="text-sm text-gray-400">
                ¿Deseas recibir tu recibo por WhatsApp?
              </p>

              <Input
                placeholder="+57 300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-black border-yellow-500/30 text-white"
              />

              <p className="text-xs text-gray-500">
                No guardamos tu número, solo lo usamos para enviar el recibo.
              </p>

              <Button
                onClick={handleSendReceipt}
                disabled={!phone || loading}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Enviando..." : "Enviar recibo por WhatsApp"}
              </Button>
            </div>
          ) : (
            <p className="text-green-400 text-sm mt-4">
              Recibo enviado correctamente 📲
            </p>
          )}

          <Button
            onClick={onClose}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
