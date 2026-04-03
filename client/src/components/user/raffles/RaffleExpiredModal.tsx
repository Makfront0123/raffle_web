"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Winner } from "@/type/Winner";
import { Raffle } from "@/type/Raffle";
import { Dispatch, SetStateAction } from "react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { usePagination } from "@/hook/usePagination";

interface Props {
  showExpiredModal: Raffle | null;
  setShowExpiredModal: Dispatch<SetStateAction<Raffle | null>>;
  winners: Winner[];
  loadingWinner: boolean;
}

import { motion, AnimatePresence } from "framer-motion";

const variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export default function RaffleExpiredModalPremium({
  showExpiredModal,
  setShowExpiredModal,
  winners,
  loadingWinner
}: Props) {

  const shouldPaginate = winners.length > 2;

  const {
    items: paginatedWinners,
    page,
    totalPages,
    nextPage,
    prevPage
  } = usePagination(winners, 2);

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    nextPage();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevPage();
  };

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

  }, [showExpiredModal, loadingWinner, winners.length]);

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
                Procesando ganador...
              </p>
            ) : (
              <>
                <div className="relative overflow-hidden">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={page}
                      custom={direction}
                      variants={variants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.35 }}
                    >
                      {(shouldPaginate ? paginatedWinners : winners).map((w: Winner) => (
                        <div
                          key={w.prize_id}
                          className="p-4 mb-2 border border-gold/50 rounded-xl bg-yellow-400/40 shadow-md"
                        >
                          <p className="font-medium text-yellow-500">{w.prize_name}</p>
                          <p>
                            <Icon icon="heroicons-outline:cash" className="mr-2 inline-block h-6 w-6" />
                            {w.value} COP
                          </p>
                          <p>
                            <Icon icon="heroicons-outline:user" className="mr-2 inline-block h-6 w-6" />
                            {w.winner_user.name}
                          </p>
                          <p>
                            <Icon icon="heroicons-outline:ticket" className="mr-2 inline-block h-6 w-6" />
                            {w.winner_ticket}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {shouldPaginate && (
                  <div className="flex justify-between items-center mt-4">
                    <Button onClick={handlePrev} disabled={page === 1}>
                      Anterior
                    </Button>

                    <span className="text-white text-sm">
                      {page} / {totalPages}
                    </span>

                    <Button onClick={handleNext} disabled={page === totalPages}>
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
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