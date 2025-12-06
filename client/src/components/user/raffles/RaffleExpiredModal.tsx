"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Winner } from "@/type/Winner";
interface Props {
  showExpiredModal: any;
  setShowExpiredModal: (v: any) => void;
  winners: any[];
  loadingWinners: boolean;
}
export default function RaffleExpiredModal({
  showExpiredModal,
  setShowExpiredModal,
  winners,
  loadingWinners,
}: Props) {
  return (
    <Dialog open={!!showExpiredModal} onOpenChange={() => setShowExpiredModal(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rifa finalizada</DialogTitle>
          {/* Descripción accesible requerida por Radix */}
          <DialogDescription>
            Información sobre la rifa finalizada y sus ganadores.
          </DialogDescription>
        </DialogHeader>

        <p>
          La rifa <strong>{showExpiredModal?.title}</strong> ha terminado 🎉
        </p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">🏆 Ganadores</h3>

          {loadingWinners ? (
            <p className="text-gray-500">Cargando ganadores...</p>
          ) : winners.length === 0 ? (
            <p className="text-gray-500">Aún no hay ganadores para esta rifa.</p>
          ) : (
            winners
              .filter((w: Winner) => w.raffle_id === showExpiredModal?.id)
              .map((w: Winner) => (
                <div key={w.id} className="p-3 mb-2 border rounded-lg shadow-sm bg-gray-50">
                  <p className="font-medium">{w.prize_name}</p>
                  <p>🎟️ Ticket ganador: {w.winner_ticket}</p>
                  <p>👤 {w.winner_user ?? "Usuario desconocido"}</p>
                  <p>💰 Valor: ${w.value}</p>
                </div>
              ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => setShowExpiredModal(null)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
