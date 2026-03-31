"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Winner } from "@/type/Winner";
import { Raffle } from "@/type/Raffle";
import { Dispatch, SetStateAction } from "react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

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

  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (showExpiredModal && !loadingWinner && winners.length > 0 && !hasCelebrated) {
      setShowConfetti(true);
      setHasCelebrated(true);

      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);

      return () => clearTimeout(timeout);
    }

    if (!showExpiredModal) {
      setHasCelebrated(false);
      setShowConfetti(false);
    }

  }, [showExpiredModal, loadingWinner, winners]);

  return (
    <>
      {showExpiredModal && showConfetti && (
        <Confetti numberOfPieces={250} />
      )}

      <Dialog open={!!showExpiredModal} onOpenChange={() => setShowExpiredModal(null)}>
        <DialogContent className="bg-black/80 text-gold border border-gold/30 shadow-2xl backdrop-blur-xl rounded-2xl">

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-400">
              🎉 Rifa Finalizada
            </DialogTitle>
            <DialogDescription className="text-yellow-400/60">
              Información del ganador.
            </DialogDescription>
          </DialogHeader>

          <p className="text-white">
            La rifa <strong>{showExpiredModal?.title}</strong> ha terminado.
          </p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-lg text-white">
              <Icon icon="material-symbols:trophy" className="mr-2 inline-block h-4 w-4" />
              Ganadores
            </h3>

            {loadingWinner ? (
              <p className="text-yellow-500/60">
                Calculando ganador...
              </p>
            ) : winners.length === 0 ? (
              <p className="text-yellow-500/60">
                La rifa ha finalizado.
                <br />
                Estamos procesando el ganador.
                <br />
                Esto puede tardar unos minutos.
              </p>
            ) : (
              winners.map((w: Winner) => (
                <div
                  key={w.prize_id}
                  className="p-4 mb-2 border border-gold/50 rounded-xl bg-yellow-400/40 shadow-md"
                >
                  <p className="font-medium text-yellow-500">{w.prize_name}</p>
                  <p><Icon icon="heroicons-outline:cash" className="mr-2 inline-block h-6 w-6" /> {w.value} COP</p>
                  <p><Icon icon="heroicons-outline:user" className="mr-2 inline-block h-6 w-6" /> {w.winner_user.name}</p>
                  <p><Icon icon="heroicons-outline:ticket" className="mr-2 inline-block h-6 w-6" /> {w.winner_ticket}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              className="bg-yellow-500 text-white hover:bg-yellow-400"
              onClick={() => setShowExpiredModal(null)}
            >
              Cerrar
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}