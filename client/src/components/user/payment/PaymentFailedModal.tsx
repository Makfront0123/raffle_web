"use client";

interface PaymentFailedModalProps {
  open: boolean;
  onClose: () => void;
  raffleName?: string;
  tickets?: string[];
  reason?: string;
}

export function PaymentFailedModal({ open, onClose, raffleName, tickets, reason }: PaymentFailedModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-black/90 to-gray-900 p-6 rounded-2xl max-w-sm w-full text-center border-2 border-yellow-400 shadow-xl">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Pago Rechazado</h2>
        <p className="text-white mb-2">{reason || "El pago no pudo completarse"}</p>
        {raffleName && <p className="text-gold mb-1">Rifa: {raffleName}</p>}
        {tickets && tickets.length > 0 && <p className="text-gold mb-4">Tickets: {tickets.join(", ")}</p>}
        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
