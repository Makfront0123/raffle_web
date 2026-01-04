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
        return <p className="p-6 text-gray-500">Rifa no encontrada</p>;
    }
    const rafflePayments = payments.filter(p => p?.id === raffleId);
    const rafflePrizes = prizes.filter(
        p => p.raffle.id === raffleId
    );
    const raffleWinners = winners.filter(w => w?.raffle_id === raffleId);
    const prizesWithWinner = rafflePrizes.filter(prize =>
        raffleWinners.some(w => w.prize_id === prize.id)
    );

    const totalRevenue = rafflePayments.reduce(
        (acc, p) => acc + Number(p.total_amount || 0),
        0
    );

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
        <main className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{raffle.title}</h1>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Volver
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Estado</CardTitle>
                    </CardHeader>
                    <CardContent className="capitalize">{realStatus}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos</CardTitle>
                    </CardHeader>
                    <CardContent>${totalRevenue.toLocaleString()}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Premios</CardTitle>
                    </CardHeader>
                    <CardContent>{rafflePrizes.length}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ganadores</CardTitle>
                    </CardHeader>
                    <CardContent>{prizesWithWinner.length}</CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Ingresos por día</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#4F46E5"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Premios y ganadores</CardTitle>
                </CardHeader>
                <CardContent>
                    {rafflePrizes.length === 0 ? (
                        <p className="text-sm text-gray-500">Sin premios registrados</p>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {rafflePrizes.map(prize => {
                                const winner = raffleWinners.find(w => w.prize_id === prize.id);
                                return (
                                    <li key={prize.id} className="border p-2 rounded">
                                        <strong>{prize.name}</strong> —{" "}
                                        {winner ? `Ganador: ${winner.winner_user?.name}` : "Sin ganador"}
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
