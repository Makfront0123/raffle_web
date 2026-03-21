import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    tickets?: string[];
    reference: string;
}

export function PaymentSuccessModalResend({
    open,
    onClose,
    tickets,
    reference,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#0B0B0B] border border-yellow-500/20 text-white max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Pago exitoso</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center text-center gap-5 py-6">
                    <CheckCircle className="w-20 h-20 text-yellow-400" />

                    <h2 className="text-2xl font-extrabold">
                        ¡Compra exitosa!
                    </h2>

                    <p className="text-gray-300">
                        Tu pago fue procesado correctamente.
                    </p>

                    <div className="bg-black/40 border border-yellow-500/10 rounded-xl p-4 w-full text-sm text-gray-300 space-y-2">
                        <p>
                            📧 Hemos enviado tu recibo a tu correo electrónico
                        </p>
                        <p className="text-gray-500 text-xs">
                            Revisa tu bandeja de entrada o spam
                        </p>
                    </div>

                    {tickets && tickets.length > 0 && (
                        <div className="w-full mt-2">
                            <p className="text-sm text-gray-400 mb-2">
                                🎫 Tus tickets:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {tickets.map((t) => (
                                    <span
                                        key={t}
                                        className="px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm font-semibold"
                                    >
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        Referencia: {reference}
                    </p>

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