"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useRaffles } from "@/hook/useRaffles";
import { usePrizes } from "@/hook/usePrizes";
import { useAdminPayments } from "@/hook/userAdminPayments";

const RaffleDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const raffleId = Number(id);

    const { raffles } = useRaffles();
    const { prizes, winners } = usePrizes();
    const { payments } = useAdminPayments();

    const raffle = raffles.find(r => r.id === raffleId);

    if (!raffle) {
        return (
            <div className="p-10 text-center text-gray-500">
                Rifa no encontrada
            </div>
        );
    }

    const rafflePayments = payments.filter(p => p?.raffle.id === raffleId);
    const rafflePrizes = prizes.filter(p => p.raffle.id === raffleId);
    const raffleWinners = winners.filter(w => w?.raffle_id === raffleId);

    const prizesWithWinner = rafflePrizes.filter(prize =>
        raffleWinners.some(w => w.prize_id === prize.id)
    );

    const totalRevenue = rafflePayments.reduce(
        (acc, p) => acc + Number(p.total_amount || 0),
        0
    );
    console.log(totalRevenue);
    const revenueMap: Record<string, number> = {};
    rafflePayments.forEach(p => {
        const date = new Date(p.created_at).toLocaleDateString();
        revenueMap[date] = (revenueMap[date] || 0) + Number(p.total_amount || 0);
    });

    const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
        date,
        revenue,
    }));

    const isExpired = new Date(raffle.end_date) < new Date();
    const realStatus =
        raffle.status === "active" && isExpired ? "expired" : raffle.status;

    return (
        <main className="bg-gray-50 min-h-screen p-4 sm:p-6 space-y-8">
            <header className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {raffle.title}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Detalle y rendimiento de la rifa
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                >
                    Volver al dashboard
                </Button>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Estado", value: realStatus },
                    { label: "Ingresos", value: `$${totalRevenue.toLocaleString()}` },
                    { label: "Premios", value: rafflePrizes.length },
                    { label: "Ganadores", value: prizesWithWinner.length },
                ].map((item) => (
                    <Card
                        key={item.label}
                        className="border-0 shadow-sm hover:shadow-md transition"
                    >
                        <CardContent className="p-6">
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className="text-2xl font-bold text-gray-900 capitalize mt-1">
                                {item.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Chart */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Ingresos por día</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    {revenueData.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6366F1"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400 text-center mt-20">
                            Sin ingresos registrados
                        </p>
                    )}
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Premios y ganadores</CardTitle>
                </CardHeader>

                <CardContent>
                    {rafflePrizes.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Sin premios registrados
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {rafflePrizes.map(prize => {
                                const winner = raffleWinners.find(
                                    w => w.prize_id === prize.id
                                );

                                return (
                                    <li
                                        key={prize.id}
                                        className="flex justify-between items-center border rounded-lg px-4 py-3 text-sm"
                                    >
                                        <span className="font-medium text-gray-900">
                                            {prize.name}
                                        </span>

                                        <span className="text-gray-500">
                                            {winner
                                                ? `Ganador: ${winner.winner_user?.name}`
                                                : "Sin ganador"}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </main>
    );
};

export default RaffleDetailPage;
