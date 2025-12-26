"use client";

import { useState, useEffect } from "react";
import { useCountdown } from "@/hook/useCountdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { Prizes } from "@/type/Prizes";
import { AuthStore } from "@/store/authStore";
import { AuthDialog } from "@/components/AuthDialog";
import { formatCOP } from "@/app/utils/formatCOP";

export default function RaffleCard({
  raffle,
  setShowExpiredModal,
}: {
  raffle: any;
  setShowExpiredModal: (raffle: any) => void;
}) {
  const timeLeft = useCountdown(raffle.end_date);
  const isExpired = new Date(raffle.end_date) <= new Date();

  const { token } = AuthStore();
  const [openAuth, setOpenAuth] = useState(false);

  /* 🏆 Premio principal seguro */
  const mainPrize: Prizes | null =
    raffle.prizes && raffle.prizes.length > 0
      ? raffle.prizes.reduce((max: Prizes, p: Prizes) =>
          Number(p.value) > Number(max.value) ? p : max
        )
      : null;

  /* 🎁 Premios secundarios (máx 3) */
  const secondaryPrizes: Prizes[] =
    raffle.prizes && raffle.prizes.length > 0
      ? raffle.prizes.filter((p: Prizes) => p.id !== mainPrize?.id)
      : [];

  const visibleSecondary = secondaryPrizes.slice(0, 3);
  const extraCount = secondaryPrizes.length - visibleSecondary.length;

  /* 🔢 Animación del valor del premio */
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!mainPrize) return;

    let start = 0;
    const end = Number(mainPrize.value);
    if (isNaN(end)) return;

    const duration = 1200;
    const increment = Math.max(end / (duration / 16), 1);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedValue(end);
        clearInterval(counter);
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [mainPrize]);

  const handleParticipar = () => {
    if (!token) {
      setOpenAuth(true);
      return;
    }
    window.location.href = `/raffles/${raffle.id}`;
  };

  const isEndingSoon =
    new Date(raffle.end_date).getTime() - Date.now() < 48 * 60 * 60 * 1000;

  return (
    <>
      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Card
          className={`relative w-full min-w-[24rem] mx-auto overflow-hidden
          rounded-2xl border border-gold/40 bg-black/60 backdrop-blur-xl
          shadow-xl transition-all duration-300
          ${isExpired
              ? "opacity-60 grayscale"
              : "hover:shadow-gold/30 hover:scale-[1.03]"
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 pointer-events-none" />

          <CardHeader className="relative z-10 space-y-3">
            <h3 className="text-xl font-bold text-yellow-500 drop-shadow">
              {raffle.title}
            </h3>

            {mainPrize && (
              <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-gray-300">
                  Premio principal
                </p>

                <p className="text-3xl font-extrabold text-yellow-500 drop-shadow">
                  {formatCOP(animatedValue)}
                </p>

                <p className="text-sm text-gray-300 flex items-center justify-center gap-1">
                  {mainPrize.type === "cash"
                    ? "💵"
                    : mainPrize.type === "trip"
                      ? "✈️"
                      : "🎁"}{" "}
                  {mainPrize.name}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Badge className="bg-black/40 border border-gold/30 text-yellow-500">
                🎟️ Ticket: {formatCOP(raffle.price)}
              </Badge>

              <Badge className="bg-black/40 border border-white/20 text-gray-200">
                🎁 {raffle.prizes?.length ?? 0} premios
              </Badge>
              <Badge className="bg-black/40 border border-white/20 text-gray-200">
                {raffle.total_numbers} números
              </Badge>
            </div>

            <p
              className={`flex items-center gap-1 text-sm font-semibold
              ${isExpired
                  ? "text-red-500"
                  : isEndingSoon
                    ? "text-red-400 animate-pulse"
                    : "text-white"
                }`}
            >
              <Timer className="h-4 w-4 text-white" /> {timeLeft}
            </p>
          </CardHeader>

          <CardContent className="relative z-10">
            <p className="text-sm text-gray-300 line-clamp-3">
              {raffle.description}
            </p>

            {visibleSecondary.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-400 mb-1">
                  Otros premios:
                </p>

                <ul className="space-y-1 text-xs text-gray-300">
                  {visibleSecondary.map((prize) => (
                    <li key={prize.id} className="flex justify-between">
                      <span>
                        {prize.type === "cash"
                          ? "💵"
                          : prize.type === "trip"
                            ? "✈️"
                            : "🎁"}{" "}
                        {prize.name}
                      </span>
                      <span className="font-semibold">
                        {formatCOP(prize.value)}
                      </span>
                    </li>
                  ))}

                  {extraCount > 0 && (
                    <li className="text-gold/80 italic">
                      + {extraCount} premios más
                    </li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="relative z-10">
            {isExpired ? (
              <Button
                variant="destructive"
                className="w-full rounded-xl"
                onClick={() => setShowExpiredModal(raffle)}
              >
                Rifa finalizada
              </Button>
            ) : (
              <Button
                className="w-full bg-yellow-600 text-white font-semibold
                hover:bg-gold-dark rounded-xl"
                onClick={handleParticipar}
              >
                Participar ahora
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
