"use client";
import React, { useState } from "react";
import { useRaffles } from "@/hook/useRaffles";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Raffle } from "@/type/Raffle";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Raffles = () => {
  const { raffles, loading, error } = useRaffles();
  const [showExpiredModal, setShowExpiredModal] = useState<Raffle | null>(null);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Cargando rifas...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="w-full min-h-[120vh] relative">
      <div className="flex flex-col items-start px-20">
        <h1 className="mt-20 text-2xl font-bold text-white mb-6">
          Participa en alguna rifa
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-10 py-3">
          {raffles.map((raffle: Raffle) => {
            const isExpired = new Date(raffle.end_date) <= new Date();

            return (
              <Card
                key={raffle.id}
                className={`p-5 w-[280px] ${isExpired ? "opacity-50 border-gray-600" : "hover:scale-105 transition-transform"
                  }`}
              >
                <CardHeader>
                  <span className="text-xl font-semibold text-white">
                    {raffle.title}
                  </span>
                  <p className="text-sm text-gray-400">${raffle.price}</p>
                  <p className="text-sm text-gray-400">
                    {raffle.total_numbers} tickets
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 mb-4">{raffle.description}</p>

                  {raffle.prizes && raffle.prizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 font-semibold">Premios:</p>
                      <ul className="list-disc list-inside text-gray-300 text-sm">
                        {raffle.prizes.map((prize) => (
                          <li key={prize.id}>
                            {prize.name} - ${prize.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isExpired ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowExpiredModal(raffle)}
                    >
                      Rifa finalizada
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href={`/raffles/${raffle.id}`}>Participar</Link>
                    </Button>
                  )}
                </CardContent>

              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal para rifas expiradas */}
      <Dialog open={!!showExpiredModal} onOpenChange={() => setShowExpiredModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rifa finalizada</DialogTitle>
          </DialogHeader>
          <p>
            La rifa <strong>{showExpiredModal?.title}</strong> ha terminado. 🎉
            No puedes participar, pero pronto habrá nuevas rifas.
          </p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowExpiredModal(null)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Raffles;
