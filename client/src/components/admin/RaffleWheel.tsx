import { Winner } from "@/type/Winner";
import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

interface RaffleWheelProps {
    winners: Winner[];
    onFinish?: () => void;
}

const RaffleWheel: React.FC<RaffleWheelProps> = ({ winners, onFinish }) => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const data = winners.map((w, index) => ({
        option: w.winner_user?.name || `Ticket ${w.winner_ticket}`,
        style: {
            backgroundColor: index % 2 === 0 ? "#6366F1" : "#22C55E",
            textColor: "#ffffff",
        },
    }));

    const startSpin = () => {
        if (!winners.length) return;
        const winnerIndex = Math.floor(Math.random() * winners.length);

        setPrizeNumber(winnerIndex);
        setMustSpin(true);
    };

    useEffect(() => {
        if (mustSpin) {
            const timer = setTimeout(() => {
                setMustSpin(false);
                onFinish?.();
            }, 5000); // duración del giro

            return () => clearTimeout(timer);
        }
    }, [mustSpin, onFinish]);

    return (
        <div className="flex flex-col items-center gap-4">
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data.length ? data : [{ option: "Sin datos" }]}
                backgroundColors={["#3e3e3e", "#df3428"]}
                textColors={["#ffffff"]}
            />

            <button
                onClick={startSpin}
                disabled={mustSpin || !winners.length}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
                {mustSpin ? "Girando..." : "Iniciar ruleta"}
            </button>
        </div>
    );
};

export default RaffleWheel;