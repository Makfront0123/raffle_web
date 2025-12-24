"use client";

import { useState } from "react";
import { useCountdown } from "@/hook/useCountdown";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { Prizes } from "@/type/Prizes";
import { AuthStore } from "@/store/authStore";
import { AuthDialog } from "@/components/AuthDialog";

export default function RaffleCard({
  raffle,
  setShowExpiredModal,
}: {
  raffle: any;
  setShowExpiredModal: any;
}) {
  const timeLeft = useCountdown(raffle.end_date);
  const isExpired = new Date(raffle.end_date) <= new Date();

  const prizeType = raffle.prizes?.[0]?.type;
  const typeIcon = prizeType === "cash" ? "💵" : prizeType === "trip" ? "✈️" : "🎁";

  const { token } = AuthStore();
  const [openAuth, setOpenAuth] = useState(false);

  const handleParticipar = () => {
    if (!token) {
      setOpenAuth(true);
      return;
    }
    window.location.href = `/raffles/${raffle.id}`;
  };

  return (
    <>
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Card
          className={`relative w-full min-w-[24rem] mx-auto overflow-hidden rounded-2xl border border-gold/40 bg-black/60 backdrop-blur-xl shadow-xl transition-all duration-300
  ${isExpired ? "opacity-60 grayscale" : "hover:shadow-gold/30 hover:scale-[1.03]"}`}
        >

          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 pointer-events-none" />
          <CardHeader className="relative z-10 pb-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.35)]">
                {raffle.title}
              </h3>

              <Badge className="text-xs flex items-center gap-1 bg-gold/20 text-gold border-gold/40">
                {typeIcon} {prizeType?.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between text-xs text-gray-300 mt-2">
              <span>💸 ${raffle.price}</span>
              <span>🎫 {raffle.total_numbers} tickets</span>
            </div>

            <p
              className={`mt-2 flex items-center gap-1 text-sm font-semibold ${isExpired ? "text-red-500" : "text-gold"
                }`}
            >
              <Timer className="h-4 w-4" /> {timeLeft}
            </p>
          </CardHeader>

          <CardContent className="relative z-10">
            <p className="text-sm text-gray-300 mb-3 line-clamp-3">{raffle.description}</p>

            {raffle.prizes?.length > 0 && (
              <div className="space-y-1 mt-3">
                <p className="text-xs font-semibold text-gray-400">Premios incluidos:</p>
                <ul className="list-disc list-inside text-gray-300 text-xs">
                  {raffle.prizes.map((prize: Prizes) => {
                    const icon =
                      prize.type === "cash" ? "💵" : prize.type === "trip" ? "✈️" : "🎁";
                    return (
                      <li key={prize.id}>
                        {icon} {prize.name} - ${prize.value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </CardContent>

          <CardFooter className="relative z-10 mt-3">
            {isExpired ? (
              <Button
                variant="destructive"
                className="w-full rounded-xl text-white"
                onClick={() => setShowExpiredModal(raffle)}
              >
                Finalizada
              </Button>
            ) : (
              <Button
                className="w-full bg-gold text-white font-semibold hover:bg-gold-dark rounded-xl"
                onClick={handleParticipar}
              >
                Participar 🎟️
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
