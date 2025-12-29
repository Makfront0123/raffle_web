"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Raffle } from "@/type/Raffle";
import { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationContent } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ConfirmActionDialog";
import { EditRaffleDialog } from "@/components/EditRaffleDialog";
import RegenerateTicketsButton from "@/components/RegenerateTicketsButton";

interface RafflesTableProps {
    raffles: Raffle[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    setCurrentPage: (page: number | ((p: number) => number)) => void;
    totalPages: number;
    deleteRaffle: (id: number) => void;
    activateRaffle: (id: number) => void;
    deactivateRaffle: (id: number) => void;
    updateRaffle: (id: number, data: Partial<Raffle>) => void;
}


export const RafflesTable = ({
    raffles,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteRaffle,
    activateRaffle,
    deactivateRaffle,
    updateRaffle,
}: RafflesTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Rifas Existentes</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {raffles.length === 0 ? (
                    <p>No hay rifas.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Título</th>
                                        <th className="px-4 py-2">Números</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2">Dígitos</th>
                                        <th className="px-4 py-2">Estado</th>
                                        <th className="px-4 py-2">Fecha</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {raffles.map((r) => {
                                        const isEnded = r.status === "ended";
                                        const expired = new Date(r.end_date) < new Date();
                                        return (
                                            <tr key={`raffle-${r.id}`} className="border-t">
                                                <td className="px-4 py-2">{r.title}</td>
                                                <td className="px-4 py-2">{r.total_numbers}</td>
                                                <td className="px-4 py-2">{r.price}</td>
                                                <td className="px-4 py-2">{r.digits}</td>
                                                <td className="px-4 py-2">{r.status}</td>
                                                <td className="px-4 py-2">{new Date(r.end_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2 flex gap-2 flex-wrap">
                                                    <ConfirmDialog
                                                        description="¿Estás seguro que quieres eliminar esta rifa?"
                                                        title="Eliminar rifa" triggerLabel="Eliminar" variant="destructive" onConfirm={() => deleteRaffle(r.id)} />
                                                    {!isEnded && (
                                                        <>
                                                            <RegenerateTicketsButton raffleId={r.id} />
                                                            <EditRaffleDialog raffle={r} onSave={(updated) => updateRaffle(r.id, updated)} />
                                                            {r.status === "pending" && !expired && (
                                                                <ConfirmDialog
                                                                    description="¿Estás seguro que quieres activar esta rifa?"
                                                                    title="Activar rifa" triggerLabel="Activar" onConfirm={() => activateRaffle(r.id)} />
                                                            )}
                                                            {r.status === "pending" && expired && (
                                                                <span className="text-xs text-red-500">Fecha vencida. Actualiza antes de activar.</span>
                                                            )}
                                                            {r.status === "active" && (
                                                                <ConfirmDialog
                                                                    description="¿Estás seguro que quieres eliminar esta rifa?"
                                                                    title="Desactivar rifa" triggerLabel="Desactivar" variant="outline" onConfirm={() => deactivateRaffle(r.id)} />
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINACIÓN */}
                        <div className="flex justify-center mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
