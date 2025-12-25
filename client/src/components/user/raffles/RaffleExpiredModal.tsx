"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Winner } from "@/type/Winner";
import { Raffle } from "@/type/Raffle";
import { Dispatch, SetStateAction } from "react";

interface Props {
  showExpiredModal: Raffle | null;
  setShowExpiredModal: Dispatch<SetStateAction<Raffle | null>>;
  winners: Winner[];
  loadingWinner: boolean;
}

export default function RaffleExpiredModalPremium({
  showExpiredModal,
  setShowExpiredModal,
  winners,
  loadingWinner
}: Props) {

  return (
    <Dialog open={!!showExpiredModal} onOpenChange={() => setShowExpiredModal(null)}>
      <DialogContent className="bg-black/80 text-gold border border-gold/30 shadow-2xl backdrop-blur-xl rounded-2xl">

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-400">🎉 Rifa Finalizada</DialogTitle>
          <DialogDescription className="text-yellow-400/60">
            Información del ganador.
          </DialogDescription>
        </DialogHeader>

        <p className="text-white">
          La rifa <strong>{showExpiredModal?.title}</strong> ha terminado.
        </p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-lg text-white">🏆 Ganadores</h3>

          {
            loadingWinner ? (
              <p className="text-gold/60">Cargando ganador...</p>
            ) : !winners ? (
              <p className="text-gold/60">Aún no hay ganador.</p>
            ) : (
              winners.map((w: Winner) => (
                <div className="p-4 mb-2 border border-gold/50 rounded-xl bg-yellow-400/40 shadow-md">
                  <p className="font-medium text-gold">{w.prize_name}</p>
                  <p>🎟️ Ticket: {w.winner_ticket?.ticket_number}</p>
                  <p>👤 {w.winner_user?.name ?? "Usuario desconocido"}</p>
                  <p>💰 Valor: ${w.value}</p>
                </div>
              ))

            )}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            className="bg-gold text-white hover:bg-yellow-400"
            onClick={() => setShowExpiredModal(null)}
          >
            Cerrar
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
