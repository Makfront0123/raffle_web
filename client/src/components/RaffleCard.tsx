"use client";

import { useCountdown } from "@/hook/useCountdown";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Prizes } from "@/type/Prizes";

export function RaffleCard({ raffle, setShowExpiredModal }: { raffle: any; setShowExpiredModal: any }) {
 
  const timeLeft = useCountdown(raffle.end_date);
  const isExpired = new Date(raffle.end_date) <= new Date();



  const prizeType = raffle.prizes?.[0]?.type;
  const typeIcon = prizeType === "cash" ? "💵" : prizeType === "trip" ? "✈️" : "🎁";

  return (
    <Card
      key={raffle.id}
      className={`w-[300px] overflow-hidden rounded-xl border border-gray-700 bg-gradient-to-b 
      from-purple-800 to-purple-900 shadow-lg transition-all duration-300 
      ${isExpired ? "opacity-60 grayscale" : "hover:shadow-2xl hover:scale-[1.03]"}
    `}
    >
      {/* Imagen (si tienes campo image_url) */}
      {raffle.image_url && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={raffle.image_url}
            alt={raffle.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{raffle.title}</h3>
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            {typeIcon} {prizeType?.toUpperCase()}
          </Badge>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>💸 ${raffle.price}</span>
          <span>🎫 {raffle.total_numbers} tickets</span>
        </div>

        <p
          className={`mt-2 text-sm font-semibold ${isExpired ? "text-red-500" : "text-green-400"
            }`}
        >
          ⏳ {timeLeft}
        </p>
      </CardHeader>

      <CardContent>
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

      <CardFooter className="mt-3">
        {isExpired ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowExpiredModal(raffle)}
          >
            Finalizada
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/raffles/${raffle.id}`}>Participar 🎟️</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
